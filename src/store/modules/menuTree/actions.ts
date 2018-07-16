import { ActionTree } from 'vuex';
import {Article, Author, Collection, DrupalMenu} from '@/types/types';
import {MenuTreeState, RootState} from '@/types/storeTypes';
import {error} from 'util';
import {MainMenuItem} from '@/classes/MainMenuItem';
import {SubmenuLink} from '@/classes/SubmenuLink';
import * as hsluv from '../../../../node_modules/hsluv/hsluv.js';
import APIService from '../../../API';
import {ArticlePeerReviewed} from '@/classes/ArticlePeerReviewed';

export const actions: ActionTree<MenuTreeState, RootState> = {

    // Creates the app's navigation menus with data from Drupal
    // parameter(s) needed:
    //      { commit } = a reference to the this store variable's mutations
    async createMenuItems({ commit }): Promise<any> {
        return APIService.fetchMenuTree()
            .then((menuTreeData) => { // : {}[]
                // Parse through all Drupal data for node representations of Drupal entities
                for (const menuItemData of menuTreeData) {
                    if (menuItemData.link.title === 'Publications') {
                        const submenuTree = menuItemData.subtree;
                        for (const submenuSection of submenuTree) {
                            for (const issueData of submenuSection.subtree) {
                                const issueDataCleaned = issueData.link;
                                if ('node' in issueDataCleaned.route_parameters) {
                                    // Issue nodes accessed
                                    // console.log(issueData.route_parameters.node);
                                }
                            }
                        }
                    }
                }
                return menuTreeData;
            }).then((menuTreeData: any) => {
                return createMenuTreeFromData(menuTreeData)
                    .then((drupalMenuTree) => {
                        return drupalMenuTree;
                    });
            }).then((drupalMenuTree) => {
                let menuTree: MainMenuItem[];

                drupalMenuTree.sort(
                    (menu1, menu2) => {
                        return menu1.weight - menu2.weight;
                    },
                );

                menuTree = createMenuItems(drupalMenuTree);

                commit('menusLoaded', menuTree);

                return menuTree;
            }).catch((error) => {
                // console.log(error);
            });
    },
};

// function fetchIssues(menuTreeData): Promise<any> {
//
// }

async function createMenuTreeFromData(menuTree: any): Promise<any> {
    const menus: DrupalMenu[] = [];
    const coverImageURL = '';

    if (menuTree.length > 0) {

        for (const menuNode of menuTree) {
            // const menuNode = menuTree[i];

            const newMenu: DrupalMenu = {
                title: menuNode.link.title,
                description: menuNode.link.description,
                weight: menuNode.link.weight,
                depth: menuNode.depth,
                url: menuNode.link.url,
                has_children: menuNode.has_children,
                subtree: await createMenuTreeFromData(menuNode.subtree),
            };

            // if menuNode is a Drupal entity
            if ('node' in menuNode.link.route_parameters) {
                const nodeNumber = menuNode.link.route_parameters.node;
                const contentData = await APIService.fetchContent(nodeNumber)
                    .then((data) => {
                        if (Object.keys(data).length > 0) {
                        const articleUUIDs: string[] = [];

                        for (const article of data.field_articles) {
                                articleUUIDs.push(article.target_uuid);
                            }

                        newMenu.coverImageURL = data.field_cover_image[0].url + '';
                        return APIService.fetchCollection(articleUUIDs);
                        }
                    }).then((articlesData) => {
                        const articles: {[nodeID: number]: Article} = {};
                        if (articlesData !== undefined) {
                            for (const articleData of articlesData) {
                                if ('field_download_' in articleData.relationships) {
                                    createArticle(articleData)
                                        .then((article: Article | void) => {
                                            if (article) {
                                                articles[articleData.attributes.nid] = article;
                                            }
                                        })
                                        .catch((error) => {
                                            // console.log(error);
                                        });

                                } else {
                                    // TODO: fill in or remove
                                }
                            }
                        }

                        const collection: Collection = {
                            articles,
                            title: newMenu.title,
                            coverImageURL: newMenu.coverImageURL + '',
                            nodeNumber,
                            uuid: '',
                        };
                        newMenu.collection = collection;
                        // return this.makeCollection(articles);
                    });
            } else {
                newMenu.coverImageURL = '';
            }
            menus.push(newMenu);
        }
    }

    return menus.sort(
        (menu1, menu2) => {
            return menu1.weight - menu2.weight;
        },
    );
}

async function createArticle(articleData: any): Promise<Article | void> {
    const authorName: string[] = (articleData.attributes.field_author.toString()).split(', ');
    const author: Author = {
        lastName: authorName[0],
        firstName: authorName[1],
    };

    return await APIService.getDownloadURL(articleData.relationships.field_download_.links.related.toString())
        .then((downloadURL: string) => {
            const article: Article = {
                author,
                title: articleData.attributes.field_title,
                subtitle: articleData.attributes.field_subtitle,
                abstract: articleData.attributes.field_abstract,
                body: articleData.attributes.body[0].processed,
                refs: articleData.attributes.field_references.processed,
                copyright: articleData.attributes.field_copyright,
                downloadURL,
                nodeNumber: articleData.attributes.nid,
                uuid: articleData.attributes.uuid,
            };

            return article;
        })
        .catch((error) => {
            // console.log(error);
        });
}

// Returns a list of main menu objects derived from Drupal-provided data
// parameter(s) needed:
//      drupalMenuTree = tree of menu objects from drupal data
// TODO: Replace contents with fetch command to wordpress API
function createMenuItems(drupalMenuTree: DrupalMenu[]): MainMenuItem[] {
    const menuItems: MainMenuItem[] = [];
    const menuColors: string[] = getUniformColors(30, drupalMenuTree.length);
    let count = 0;

    for (const drupalMenu of drupalMenuTree) {
        let menuSections: { [sectionHeader: string]: SubmenuLink[] };
        let isSectioned: boolean = true;

        if (drupalMenu.has_children) { // If a submenu exists

            for (let i = 0; i < drupalMenu.subtree.length; i++) {
                const section = drupalMenu.subtree[i];
                if (!section.has_children) {
                    isSectioned = false;
                }
            }

            menuSections = menuSectionsFromDrupalMenu(
                drupalMenu.subtree,
                drupalMenu.title + '',
                isSectioned);
        } else { // No submenu exists, i.e. 'Volunteer' & 'Contribute'
            menuSections = {};
        }

        menuItems.push(
            new MainMenuItem(
                drupalMenu.title,
                menuColors[count],
                // url
                // drupalMenu.url,
                '',
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

        count++;
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
            for (let i = 0; i < drupalSections.length; i++) {
                const drupalSection = drupalSections[i];
                const sectionList: SubmenuLink[] = [];

                if (drupalSection.has_children && drupalSection.depth === 2) {
                    // Then add title of section to list of rendered menu sections
                    // sectionLink : DrupalMenu
                    for (const sectionLink of drupalSection.subtree) {

                        if (sectionLink.coverImageURL === undefined) {
                            sectionLink.coverImageURL = 'poop';
                        }

                        let submenuLink: SubmenuLink;

                        if (sectionLink.collection) {
                            submenuLink =
                                new SubmenuLink(
                                    sectionLink.title,
                                    sectionLink.coverImageURL + '',
                                    sectionLink.collection.articles,
                                    0,
                                    'uuid',
                                    sectionLink.url,
                                );
                        } else {
                            submenuLink =
                                new SubmenuLink(
                                    sectionLink.title,
                                    sectionLink.coverImageURL + '',
                                    {},
                                    0,
                                    'uuid',
                                    sectionLink.url,
                                );
                        }

                        sectionList.push(submenuLink);

                        // console.log(submenuLink);

                    }
                    menuSections[drupalSection.title] = sectionList;
                }
                // } else if (!drupalSection.has_children && drupalSection.depth === 2) { // Else if submenu links
                //     console.log('error');
                //     const submenuLink: SubmenuLink = new SubmenuLink(drupalSection.title, drupalSection.url);
                //     sectionList.push(submenuLink);
                //     menuSections[parentTitle] = sectionList;
                // }
            }
        } else { // If the submenu links belong to no section except the main menu entry
            // console.log(drupalSections);
            const menuList: SubmenuLink[] = [];
            // link : DrupalMenu
            for (const link of drupalSections) {
                if (link.coverImageURL === undefined) {
                    link.coverImageURL = '';
                }

                const submenuLink: SubmenuLink = new SubmenuLink(
                    link.title,
                    link.coverImageURL,
                    {},
                    0,
                    'uuid',
                    link.url,
                );
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
        const L: number = 90; // 95
        const C: number = 25; // 50
        const hMax: number = 360; // 360

        let index = 0;
        start = 27;
        for (let i = start; i < 360; i += hMax / numberOfColors) {
            uniformColors[index] = hsluv.hsluvToRgb((hsluv.lchToHsluv([L, C, i])));
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

