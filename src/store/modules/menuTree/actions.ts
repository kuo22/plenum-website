import { ActionTree } from 'vuex';

import * as hsluv from '../../../../node_modules/hsluv/hsluv.js';

import APIService from '../../../API';
import {MenuTreeState} from '@/store/modules/menuTree/menuTreeModule';
import {RootState} from '@/store';

export const actions: ActionTree<MenuTreeState, RootState> = {

    // Create the app's navigation menus via API data
    async createMenu({ commit, dispatch }): Promise<any> {
        return APIService.fetchMenuTree()
            .then(dirtyMenuTreeData => dirtyMenuTreeData.map(processMenuData))
            .then(menuTreeData => fillMissingDataInMenuTree(menuTreeData, 1, dispatch))
            .then(minimalMenuTree => {
                let menuColors = getPerceptuallyUniformColors(27, minimalMenuTree.length);
                minimalMenuTree.map((mainMenuItem, i) => mainMenuItem.color =  menuColors[i]);

                commit('menusLoaded', minimalMenuTree);

                return minimalMenuTree;
            }).catch((err) => {
                // TODO: handle error
                console.error(err);
            });
    },

    closeMenuExpansions({ commit, getters }) {
        if (getters.anyMenuIsOpen) {
            commit('deactivateAllPreviews');
            commit('deactivateMainMenuItems');
        }
    },

    closeMainMenu({ commit }) {
        commit('deactivateMainMenuItems');
    },

    openMainMenuItem({ commit, getters }, menuItem) {
        // TODO: remove redundancy with closeMenuExpansions
        if (getters.anyMenuIsOpen) {
            commit('deactivateAllPreviews');
            commit('deactivateMainMenuItems');
        }
        commit('activateMainMenuItem', menuItem);
    },

    // Deactivates current preview, and turns on requested preview
    activateSubmenuPreview({ commit, state }, newActivation) {
        let menuTree = [...state.main];
        // TODO: make toggleActivation 'global' to prevent remaking of function on each call to this method
        let toggleActivation = (submenuItem) => {
            submenuItem.expanded = submenuItem.uuid === newActivation.uuid;
            return submenuItem;
        };
        menuTree = menuTree.map((mainMenuItem: any) => {
            if (mainMenuItem.expanded && mainMenuItem.hasSections) { // Expanded with sections
                mainMenuItem.submenu.map(section => {
                    section.submenu.map(toggleActivation)
                })
            } else if (mainMenuItem.expanded) { // Expanded with links
                mainMenuItem.submenu.map(toggleActivation)
            }
            return mainMenuItem;
        });

        commit('updateMenuTree', menuTree);
    },

    deactivateAllPreviews({ commit, state }) {
        let menuTree = [...state.main];
        menuTree = menuTree.map(deactivateSubmenus);
        commit('updateMenuTree', menuTree);
    }
};

// Processes Drupal data from the Menu Items API and returns a front-end ready menu tree
// parameter:
//      Object = Object tree of menu item nodes
let processMenuData = ({title, description, uri, uuid, expanded, weight, below}) => {
    let menuItem: any = {title, description, weight, uuid};

    if (uri.match(/\d+/g)) { // If any digit in URI (Drupal nodes contain digits, menu groups do not)
        menuItem.node = uri.substring(5, uri.length);
    }

    menuItem.hovered= false;

    if (below) {
        menuItem.expanded = expanded;
        menuItem.submenu = below.map(processMenuData).sort((a, b) => a.weight - b.weight);
    }

    return menuItem;
};

// Deactivates provided submenu item
// parameter:
//      submenuItem = fly out submenu item
let deactivateAll = (submenuItem) => {
    submenuItem.expanded = false;
    return submenuItem;
};

// Deactivates all submenu items of the provided main menu item parent
let deactivateSubmenus = (mainMenuItem) => {
    if (mainMenuItem.expanded && mainMenuItem.hasSections) { // Expanded with sections
        mainMenuItem.submenu = mainMenuItem.submenu.map(section => {
            section.submenu = section.submenu.map(deactivateAll); //this.submenuFn
            return section;
        });
    } else if (mainMenuItem.expanded) { // Expanded with links // TODO: deprecate, straight links should not preview
        mainMenuItem.submenu = mainMenuItem.submenu.map(deactivateAll) //this.submenuFn
    }
    return mainMenuItem;
};

// Returns a menu tree containing all basic data for the menu
async function fillMissingDataInMenuTree(menuTree, depth, dispatch): Promise<any> {
    let menus = await Promise.all(menuTree.slice(0).map(async (item) => { // Map a copy of the inputted menuTree
        item.depth = depth;

        if (item.node && item.depth == 3) { // CURRENT MENU ITEM IS A CONTENT COLLECTION (MENUBAR AND BUTTON)
            let collectionData = await APIService.fetchCollectionMenuData(item.uuid);

            if (collectionData[collectionData.length - 1].type.startsWith('file')) {
                // TODO: make sure to reference drupal hostname and port in production
                item.imageURL = window.location.origin.replace(/0/g, '8') + collectionData.pop().attributes.url;
            }

            console.log(collectionData);
            item.articles = collectionData.map(({ attributes, type }) => {
                //console.log(attributes);
                return {
                    type: type,
                    uuid: attributes.uuid,
                    // node: attributes.type
                    author: attributes.field_author.split(';').map(fullname => {
                        return fullname.split(',').reverse().map(name => name.trim()).join(' ');
                    }),
                    title: attributes.field_title,
                    subtitle: attributes.field_subtitle,
                    abstract: attributes.field_abstract,
                    previewVisible: false
                }
            });

            item.expanded = false;
        } else if (item.node) {     // MENU LINK
            item.href = "/" + item.title.toLowerCase().replace(/ /g, '-');
        } else if (item.submenu) {  // ELSE IF SUBMENU AND NO NODE, CURRENT MENUITEM IS A MENUBAR/ GROUP
            item.submenu = await fillMissingDataInMenuTree(item.submenu, depth + 1, dispatch);
        } else {                    // CURRENT MENU ITEM IS UNDER CONSTRUCTION / UNAVAILABLE
            item.disabled = true;
        }

        item.hasSections = (item.depth == 1) && item.submenu && item.submenu.some(menu => !menu.uuid);

        return item;
    }));

    return menus.sort((a: any, b: any) => a.weight - b.weight);
}


// Returns a collection of perceptually uniform colors in RGB form
// Colors are selected at equal intervals along the LCH uniform color space
// with the starting point along the gradient determined by the provided parameter
// parameter(s) needed:
//      start = starting point of color selection along a cyclical color wheel
//                  must be 0 - 90
function getPerceptuallyUniformColors(start: number, numberOfColors: number): string[] {
    const uniformColors: string[] = [];

    if (start > 90 || start < 0) {
        console.error('Number can\'t be 90 or greater. Number provided: ' + start);
    } else {
        const L = 90;       // Lightness
        const C = 25;       // Chroma
        const hMax = 360;   // Hue
        const hInterval = hMax / numberOfColors;

        for (let H = start; H < hMax; H += hInterval) {
            uniformColors.push(hsluv.hsluvToRgb((hsluv.lchToHsluv([L, C, H]))).reduce(decimalColorToString, 'rgb('));
        }
    }

    return uniformColors;
}

// Returns an rgb style string of a provided rgb color in decimal form
// parameter(s) needed:
//      colorString         = accumulation of rgb string
//      singleColorValue    = decimal value of an isolated rgb value (r, g, or b)
//      i                   = current index of the reduced array
let decimalColorToString = (colorString: string, singleColorValue: number, i: number): string => {
    return colorString + Math.round(singleColorValue * 255) + (i === 2 ? ')' : ', ');
};

