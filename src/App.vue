<template>
    <div id="app">
        <nav-bar :menuItems="menuItems" id="menu-grid-section"></nav-bar>
        <transition name="fade" mode="in-out">
            <router-view class="view content-section"></router-view>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {State, Action, Getter} from 'vuex-class';
import Home from '@/views/Home';
import NavBar from '@/views/NavBar';
import { DrupalMenu } from './types/types';

const namespace: string = 'menuTree';

import { Article, Issue, Author } from './types/types';
import {MainMenuItem} from './classes/MainMenuItem';
import {error} from 'util';

import * as hsluv from '../node_modules/hsluv/hsluv.js';
import {MenuTreeState} from './types/storeTypes';
import {SubmenuLink} from './classes/SubmenuLink';
// TODO: move Menus out of view folder, it's a component!


@Component({
    components: {
        NavBar,
        Home,
    },
})

export default class App extends Vue {
    @Action('fetchMenuData', { namespace }) public fetchData: any; // Action that calls Drupal API
    @Getter('drupalMenuTree', { namespace }) public drupalMenuTree: DrupalMenu[]; //

    private issues: Issue[] = [];
    private menuItems: MainMenuItem[] = [];

    constructor() {
        super();
    }

    // When the app is created, tell the store to fetch menu data
    public async created(): void {
        await this.fetchData()
            .then(() => {
                this.menuItems = this.createMenuItems(this.drupalMenuTree);
            })
        // TODO: figure out why this catch is being triggered
            .catch();

        // getIssues
        // initialize store with issues


        // this.getIssues();
        // for (let i = 0; i <= this.issues.length; i++) {
        //     const issue: Issue = this.issues[i];
        // }
    }

    // Returns a list of main menu objects derived from Drupal-provided data
    // parameter(s) needed:
    //      drupalMenuTree = tree of menu objects from drupal data
    // TODO: Replace contents with fetch command to wordpress API
    private createMenuItems(drupalMenuTree: DrupalMenu[]): MainMenuItem[] {
        const menuItems: MainMenuItem[] = [];
        const menuColors: string[] = this.getUniformColors(20);

        for (let i = 0; i < drupalMenuTree.length; i++) {
            const drupalMenu = drupalMenuTree[i];
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
    private getUniformColors(start: number): string[] {
        const uniformColors: number[number[]] = [];
        const uniformColorsAsString: string[] = [];

        if (start > 90 || start < 0) {
            error('Number can\'t be 90 or greater. Number provided: ' + start);
        } else {
            const L: number = 95;
            const C: number = 50;
            const hMax: number = 360;
            const numberOfMenus: number = this.drupalMenuTree.length;

            let index = 0;
            for (let i = start; i < 360; i += hMax / numberOfMenus) {
                uniformColors[index] = (hsluv.hsluvToRgb(hsluv.lchToHsluv([L, C, i])));
                index++;
            }
        }

        return this.colorToString(uniformColors);
    }

    // Returns an rgb style string of a provided color
    // Provided color must be in the form of a matrix
    // parameter(s) needed:
    //      colors = set of colors in the form of a matrix
    private colorToString(colors: number[number[]]): string[] {
        const uniformColorsAsString: string[] = [];

        for (const color of colors) {
            const colorString: string = 'rgb(' +
                color[0] * 255 + ', ' +
                color[1] * 255 + ', ' +
                color[2] * 255 + ')';
            uniformColorsAsString.push(colorString);
        }

        return uniformColorsAsString;
    }



    private getIssues(): void {
        const issuesJSON = fetch('http://localhost:8888/plenum-drupal-dev/drupal-8.5.3/jsonapi/node/issue'
                                + '?_format=json')
            .then((response) =>
                response.json().then((data) => ({
                        data,
                        status: response.status,
                    }),
                ).then((res) => {
                    // console.log(res.data.data);
                    this.issues = this.createIssues(res.data);

                    // this.parseData(res.data[this.articleId]);
                }))
            .catch(); // Throw DOM display that article does not exist
    }

    private createIssues(responseData): Issue[] {
        const data = responseData.data;
        const issues: Issue[] = [];

        for (const issueData of data) {
            // create issue in vue
            // add issue to issue array in store?
            const issue: Issue = {
                articles: [],
                nodeNumber: null,
                uuid: issueData.attributes.uuid,
                title: issueData.attributes.title,
                articleIds: this.getArticleIds(issueData.relationships.field_articles.data),
            };

            issues.push(issue);
        }
        // console.log(issues);
        return issues;
    }

    // TODO create interface for article, so ID is recognized by INTELLIJ
    private getArticleIds(articleData: [{}]): string[] {
        const articleIds = [];

        for (const article of articleData) {
            articleIds.push(article.id);
        }

        return articleIds;
    }
}
</script>

<style lang="scss">
    $menuFont: 'Avenir', 'Open Sans', sans-serif;
    $readFont: 'Crimson Text', serif;
    $lefterWidth: 240px;
    $activeSubmenuWidth: 20px;
    $borderWidth: 3px;

    * {
        margin: 0;
        padding: 0;
        color: black;
        list-style-type: none;
    }


  #app {
    font-family: $menuFont;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
      width: 100%;
      height: 100vh;
  }

  h1 {
      font-size: 1.75em;
  }

  h2 {
      font-size: 1.4em;
  }
  
  #menu-grid-section {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: $lefterWidth;
      z-index: 4;
  }

  .content-section {
      width: calc(100% - #{$lefterWidth});
      height: 100vh;
      position: absolute;
      right: 0;
      bottom: 0;
  }

  .fade-enter-active, .fade-leave-active {
      transition: opacity .1s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
  }
</style>