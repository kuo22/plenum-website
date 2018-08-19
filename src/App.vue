<template>
    <div
        id="app"
        @keydown.tab="closeFlyOut"
    >
        <transition appear>
            <the-nav-bar
                    class="lefter"
                    :menuItems="menuItems"

                    @logoClicked="closeFlyOut"
            ></the-nav-bar>
        </transition>

        <transition
                name="component-fade"
                mode="out-in"
        >
            <router-view
                    class="content-section"
                    @click.native="closeFlyOut"
                    @focus.native="closeFlyOut"
            >
            </router-view>
        </transition>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import TheNavBar from '@/components/TheNavBar';
import {Action, Getter} from 'vuex-class';
import Home from '@/views/Home';

import {Article, Collection} from './types/types';
import { MainMenuItem } from './classes/MainMenuItem';

import API from '@/API';
import {SubmenuLink} from './classes/SubmenuLink';

// TODO: move Menus out of view folder, it's a component!

const namespace: string = 'menuTree';


@Component({
    components: {
        TheNavBar,
        Home,
    },
})

export default class App extends Vue {
    @Action('createMenuItems', { namespace }) private createMenuItems: any;
    @Getter('menuTree', { namespace }) private menuTree: MainMenuItem[];
    @Prop() private menuItems: MainMenuItem[];

    constructor() { super(); }

    // When the app is created, tell the store to fetch menu data
    public async created(): void {
        await this.createMenuItems()
            .then(() => {
                // TODO: don't change the prop, figure out how to initialize prop with 'menuTree' or convert all changes
                // to menuItems via the store
                this.menuItems = this.menuTree;
            })
            .catch();
    }

    // Closes the flyout menu
    private closeFlyOut(): void {

        for (let i = 0; i < this.menuItems.length; i++) {
            if (this.menuItems[i].open) {
                for (const submenuItemKey: string in this.menuItems[i].subMenu) {
                    if (this.menuItems[i].subMenu.hasOwnProperty(submenuItemKey)) {
                        for (let j = 0; j < this.menuItems[i].subMenu[submenuItemKey].length; j++) {
                            // (this.menuItems[i].subMenu[submenuItemKey][j] as Article).previewVisible = false;
                            (this.menuItems[i].subMenu[submenuItemKey][j] as SubmenuLink).active = false;
                            (this.menuItems[i].subMenu[submenuItemKey][j] as SubmenuLink).hidden = true;
                        }
                    }
                }
            }
        }
        // this.$refs.theMainMenu.closeMainMenuFlyOut();
        for (const menuItemIndex: number in this.menuItems) {
            if (this.menuItems.hasOwnProperty(menuItemIndex.toString())) {
                this.menuItems[menuItemIndex].open = false;
                setTimeout(() => {
                    this.menuItems[menuItemIndex].hidden = true;
                }, 400);
            }
        }
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
                    this.createIssues(res);
                    // this.parseData(res.data[this.articleId]);
                }))
            .catch(); // Throw DOM display that article does not exist
    }

    private createIssues(responseData: any): Collection[] {
        const data = responseData.data;
        const issues: Collection[] = [];

        for (const issueData of data) {
            let imageCoverURL = '';
            // fetch issue cover image urls from api

            API.fetchContent(issueData.attributes.nid)
                .then((coverURL) => {
                    imageCoverURL = coverURL;
                })
                .catch();

            // create issue in vue
            // add issue to issue array in store?
            const issue: Collection = {
                title: issueData.attributes.title,
                coverImageURL: imageCoverURL,
                articles: [],
                nodeNumber: null,
                uuid: issueData.attributes.uuid,
                collectionContentIDs: this.getArticleIds(issueData.relationships.field_articles.data),
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
    $border: 3px solid black;

    * {
        margin: 0;
        padding: 0;
        color: black;
        list-style-type: none;
    }

    a {
        text-decoration: none;
    }

    #app {
        width: 100vw;
        height: 100vh;

        color: #2c3e50;

        text-align: center;
        font-family: $menuFont;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
    }

    .lefter {
        position: absolute;
        top: 0;
        left: 0;
        width: $lefterWidth;
        height: 100%;
        z-index: 4;

        outline: $border;
    }

    .grid-frame {
        width: $lefterWidth;
        height: $lefterWidth;

        background: white;

        text-align: center;
    }

    .before-appear {
        opacity: 0;
    }

    .appear {
        transition: opacity 0.3s ease-in;
    }

    .after-appear {
        opacity: 1;
    }

    .content-section {
        position: absolute;
        width: calc(100% - #{$lefterWidth});
        height: 100vh;
        right: 0;
        bottom: 0;

        overflow-x: hidden;
    }

    .component-fade-enter-active, .component-fade-leave-active {
        transition: opacity .3s ease;
    }
    .component-fade-enter, .component-fade-leave-to
        /* .component-fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>