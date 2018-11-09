import { ActionTree } from 'vuex';

import * as hsluv from '../../../../node_modules/hsluv/hsluv.js';

import api from '../../../lib/api';
import {MenuTreeState} from '@/store/modules/menuTree/menuTreeModule';
import {RootState} from '@/store';

function createHardCodedMenu() {
    const aboutMainMenu = {
        title: "About",
        alt: "About sections",
        weight: -49,
        hovered: false,
        expanded: false,
        path: '/about',
        depth: 1
    };

    const publicationsMainMenu = {
        title: "Publications",
        alt: "Publications",
        weight: -48,
        hovered: false,
        expanded: false,
        path: '/publications',
        submenu: api.findMostRecentCollectionsForMenu(5).then(cols => {
            console.log(cols);
            return cols
        }),
        depth: 1
    };

    const contributeMainMenu = {
        title: "Contribute",
        alt: "Contribute",
        weight: -47,
        hovered: false,
        expanded: false,
        path: '/contribute',
        depth: 1
    };

    const joinUsMainMenu = {
        title: "Join Us",
        alt: "Join us",
        weight: -46,
        hovered: false,
        expanded: false,
        path: '/join-us',
        depth: 1,
        uuid: '43e759e0-324f-41be-a8a3-3ba61d09730a'
    };

    let menu: Array<any> = [aboutMainMenu, publicationsMainMenu, contributeMainMenu, joinUsMainMenu];
    let menuColors = getPerceptuallyUniformColors(27, menu.length);
    return menu.map((menuItem, i) => {
        menuItem.color = menuColors[i];
        return menuItem;
    });
}

export const actions: ActionTree<MenuTreeState, RootState> = {

    // Create the app's navigation menus via API data
    async createMenu({ commit, dispatch }): Promise<any> {
        return commit('initMenus', createHardCodedMenu());
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

    activateSubmenuPreviewByTitle({ commit, state, dispatch }, pubTitle) {
        // let pub = state.main.reduce((pub: any, mainMenuItem: any) => {
        //     if (!mainMenuItem.submenu) {
        //         return pub;
        //     } else {
        //         let tempPub = mainMenuItem.submenu.reduce((potPub, section) => {
        //             if (section.submenu) {
        //                 let pub = section.submenu.find(pub => pub.title === pubTitle);
        //                 if (pub) {
        //                     return pub;
        //                 } else {
        //                     return potPub;
        //                 }
        //             }
        //         }, {});
        //         if (tempPub === undefined || !tempPub.title) {
        //             return pub;
        //         } else {
        //             return tempPub;
        //         }
        //     }
        // }, {});
        let menuContext = state.main.reduce((pub: any, mainMenuItem: any) => {
            if (!mainMenuItem.submenu) {
                return pub;
            } else {
                let tempPub = mainMenuItem.submenu.reduce((potPub, section) => {
                    if (section.submenu) {
                        let pub = section.submenu.find(pub => pub.title === pubTitle);
                        if (pub) {
                            return pub;
                        } else {
                            return potPub;
                        }
                    }
                }, {});
                if (tempPub === undefined || !tempPub.title) {
                    return pub;
                } else {
                    return {
                        pub: tempPub,
                        mainMenuItem: mainMenuItem
                    };
                }
            }
        }, {});
        if (menuContext) {
            dispatch(
                'openMainMenuItem',
                menuContext.mainMenuItem
            ).then(res => {
                dispatch(
                    'activateSubmenuPreview',
                    menuContext.pub
                );
            });
        } else {
            console.error('Cannot find issue: ' + pubTitle);
        }
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
            let collectionData = await api.fetchCollectionMenuData(item.uuid);

            if (collectionData[collectionData.length - 1].type.startsWith('file')) {
                // TODO: make sure to reference drupal hostname and port in production
                item.imageURL = window.location.origin.replace(/0/g, '8') + collectionData.pop().attributes.url;
            }

            item.articles = collectionData.map(({ attributes, type }) => {
                return {
                    type: type,
                    uuid: attributes.uuid,
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

    return menus.sort((a: any, b: any) => a.disabled ? 1 : a.weight - b.weight);
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

