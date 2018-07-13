<template>
    <div id="app">
        <nav-bar :menuItems="menuItems" id="menu-grid-section"></nav-bar>
        <transition name="component-fade" mode="out-in">
            <router-view class="view content-section"></router-view>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {Action, Getter} from 'vuex-class';
import Home from '@/views/Home';
import NavBar from '@/views/NavBar';

import { Collection } from './types/types';
import { MainMenuItem } from './classes/MainMenuItem';

import API from '@/API';

// TODO: move Menus out of view folder, it's a component!

const namespace: string = 'menuTree';


@Component({
    components: {
        NavBar,
        Home,
    },
})

export default class App extends Vue {
    @Action('createMenuItems', { namespace }) private createMenuItems: any;
    @Getter('menuTree', { namespace }) private menuTree: MainMenuItem[];

    private issues: Collection[] = [];
    private menuItems: MainMenuItem[] = [];

    constructor() {
        super();
    }

    // When the app is created, tell the store to fetch menu data
    public async created(): void {
        await this.createMenuItems()
            .then(() => {
                this.menuItems = this.menuTree;
            })
            .catch();

        // getIssues
        // initialize store with issues


        // this.getIssues();
        // for (let i = 0; i <= this.issues.length; i++) {
        //     const issue: Issue = this.issues[i];
        // }
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

            API.fetchCoverURL(issueData.attributes.nid)
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
    $lefterWidth: 2400px;
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

    .component-fade-enter-active, .component-fade-leave-active {
        transition: opacity .3s ease;
    }
    .component-fade-enter, .component-fade-leave-to
        /* .component-fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>