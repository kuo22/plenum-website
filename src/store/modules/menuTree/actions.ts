import { ActionTree } from 'vuex';
import {DrupalMenu} from '@/types/types';
import {MenuTreeState, RootState} from '@/types/storeTypes';
import {error} from 'util';
import {MainMenuItem} from '@/classes/MainMenuItem';
import {SubmenuLink} from '@/classes/SubmenuLink';
import * as hsluv from '../../../../node_modules/hsluv/hsluv.js';
import APIService from '../../../API';

export const actions: ActionTree<MenuTreeState, RootState> = {
    createMenuItems({ commit }): Promise<any> {
        return APIService.fetchMenuTree()
            .then((menuTreeData: any) => {
                const drupalMenuTree: DrupalMenu[] = createMenuTreeFromData(menuTreeData).sort(
                    (menu1, menu2) => {
                        return menu1.weight - menu2.weight;
                    },
                );

                const menuTree: MainMenuItem[] = createMenuItems(drupalMenuTree);

                commit('menusLoaded', menuTree);
            })
            .catch((error) => {
                commit('menusError');
            });
    },
};

function createMenuTreeFromData(menuTree: any): DrupalMenu[] {
    const menus: DrupalMenu[] = [];
    if (menuTree.length > 0) {
        for (const menuNode of menuTree) {
            const newMenu: DrupalMenu = {
                title: menuNode.link.title,
                description: menuNode.link.description,
                weight: menuNode.link.weight,
                depth: menuNode.depth,
                url: menuNode.link.url,
                has_children: menuNode.has_children,
                subtree: createMenuTreeFromData(menuNode.subtree),
            };
            menus.push(newMenu);
        }
    }

    return menus;
}

// Returns a list of main menu objects derived from Drupal-provided data
// parameter(s) needed:
//      drupalMenuTree = tree of menu objects from drupal data
// TODO: Replace contents with fetch command to wordpress API
function createMenuItems(drupalMenuTree: DrupalMenu[]): MainMenuItem[] {
    const menuItems: MainMenuItem[] = [];
    const menuColors: string[] = getUniformColors(20, drupalMenuTree.length);

    for (let i = 0; i < drupalMenuTree.length; i++) {
        const drupalMenu: DrupalMenu = drupalMenuTree[i];
        let menuSections: { [sectionHeader: string]: SubmenuLink[] };
        let isSectioned: boolean = true;

        if (drupalMenu.has_children) { // If a submenu exists
            for (const section: DrupalMenu of drupalMenu.subtree) {
                if (!section.has_children) {
                    isSectioned = false;
                }
            }
            menuSections = menuSectionsFromDrupalMenu(drupalMenu.subtree,
                drupalMenu.title,
                isSectioned);
        } else { // No submenu exists, i.e. 'Volunteer' & 'Contribute'
            menuSections = {};
        }

        menuItems.push(
            new MainMenuItem(
                drupalMenu.title,
                menuColors[i],
                // url
                drupalMenu.url,
                menuSections,
                //
                // recurse to create menuItems, if
                // object array with keys from first submenu
                // and array of values obtained from children of submenu
                // {
                //     test: ['test1', 'test2'],
                // },
            ),
        );
    }

    return menuItems;

    // Returns a list of menu sections derived from the provided drupal-like menu
    // parameter(s) needed:
    //      subTree     =
    //      parentTitle =
    function menuSectionsFromDrupalMenu(drupalSections: DrupalMenu[],
                                        parentTitle: string,
                                        hasSections: boolean): { [sectionTitle: string]: SubmenuLink[] } {
        const menuSections: { [sectionTitle: string]: SubmenuLink[] } = {};

        if (hasSections) {
            for (const drupalSection: DrupalMenu of drupalSections) {
                const sectionList: SubmenuLink[] = [];

                if (drupalSection.has_children && drupalSection.depth === 2) {
                    // Then add title of section to list of rendered menu sections
                    for (const sectionLink: DrupalMenu of drupalSection.subtree) {
                        const submenuLink: SubmenuLink = new SubmenuLink(sectionLink.title, sectionLink.url);
                        sectionList.push(submenuLink);
                    }
                    menuSections[drupalSection.title] = sectionList;
                } else if (!drupalSection.has_children && drupalSection.depth === 2) { // Else if submenu links
                    const submenuLink: SubmenuLink = new SubmenuLink(drupalSection.title, drupalSection.url);
                    sectionList.push(submenuLink);
                    menuSections[parentTitle] = sectionList;
                }
            }
        } else {
            const menuList: SubmenuLink[] = [];
            for (const link: DrupalMenu of drupalSections) {
                const submenuLink: SubmenuLink = new SubmenuLink(link.title, link.url);
                menuList.push(submenuLink);
            }
            menuSections[parentTitle] = menuList;
        }

        return menuSections;
    }
}

// Returns a collection of perceptually uniform colors in RGB form
// Colors are selected at equal intervals along the LCH uniform color space
// with the starting point along the gradient determined by the provided parameter
// parameter(s) needed:
//      start = starting point of color selection along a cylical color wheel
//                  must be 0 - 90
function getUniformColors(start: number, numberOfColors: number): string[] {
    const uniformColors: number[][] = [];
    const uniformColorsAsString: string[] = [];

    if (start > 90 || start < 0) {
        error('Number can\'t be 90 or greater. Number provided: ' + start);
    } else {
        const L: number = 95;
        const C: number = 50;
        const hMax: number = 360;

        let index = 0;
        for (let i = start; i < 360; i += hMax / numberOfColors) {
            uniformColors[index] = (hsluv.hsluvToRgb(hsluv.lchToHsluv([L, C, i])));
            index++;
        }
    }

    return colorToString(uniformColors);
}

// Returns an rgb style string of a provided color
// Provided color must be in the form of a matrix
// parameter(s) needed:
//      colors = set of colors in the form of a matrix
function colorToString(colors: number[][]): string[] {
    const uniformColorsAsString: string[] = [];

    for (const color of colors) {
        const colorString: string = 'rgb(' +
            // Rounded numbers to work with chrome
            Math.round(color[0] * 255) + ', ' +
            Math.round(color[1] * 255) + ', ' +
            Math.round(color[2] * 255) + ')';
        uniformColorsAsString.push(colorString);
    }

    return uniformColorsAsString;
}

