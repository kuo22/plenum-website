<template>
    <div id="app">
        <nav-bar id="menu-grid-section"></nav-bar>
        <transition name="fade" mode="in-out">
            <router-view class="view content-section"></router-view>
        </transition>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import Home from '@/views/Home';
import NavBar from '@/views/NavBar';
import { Article, Issue, Author} from './types';
// TODO: move Menus out of view folder, it's a component!


@Component({
    components: {
        NavBar,
        Home,
    },
})

export default class App extends Vue {
    private issues: Issue[] = [];

    constructor() {
        super();
    }

    public created(): void {
        this.getIssues();
        for (let i = 0; i <= this.issues.length; i++) {
            const issue: Issue = this.issues[i];
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
                uuid: issueData.attributes.uuid,
                title: issueData.attributes.title,
                articleIds: this.getArticleIds(issueData.relationships.field_articles.data),
            };

            issues.push(issue);
        }
        // console.log(issues);
        return issues;
    }

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