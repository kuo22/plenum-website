<template>
    <main id="text-article-view">
        <span id="active-submenu-spacer"></span>
        <header>
            <div class="article-info">
                <div class="titles">
                    <h1 class="title">
                        {{ this.article.title }}
                    </h1>
                    <h2 class="subtitle">
                        {{this.article.subtitle}}
                    </h2>
                </div>
                <!-- make author card a component -->
                <h3 class="author">
                    <em>{{this.article.author.firstName}} {{this.article.author.lastName}}</em>
                </h3>
            </div>
        </header>
        <div id="text-article">
            <div id="article-page">
                <div id="article">
                    <div id="abstract">
                        <h4 id="abstract-title">ABSTRACT</h4>
                        <!--span class="tab"></span-->
                        <p>
                            {{this.article.abstract}}
                        </p>
                    </div>

                    <hr>

                    <!--<div id="in-page-article-info" class="article-info">-->
                        <!--<div class="titles">-->
                            <!--<h1 class="title">-->
                                <!--{{this.article.title}}-->
                            <!--</h1>-->
                            <!--<h2 class="subtitle">-->
                                <!--{{this.article.subtitle}}-->
                            <!--</h2>-->
                        <!--</div>-->
                        <!--<h3 class="author">-->
                            <!--<i>{{this.article.author.firstName}} {{this.article.author.lastName}}</i>-->
                        <!--</h3>-->
                    <!--</div>-->

                    <div id="article-body">
                        <p v-html="this.article.body"></p>
                    </div>

                    <hr>

                    <div id="bibliography">
                        <h4>BIBLIOGRAPHY</h4>

                        <p v-html="this.article.refs"></p>
                    </div>
                </div>
            </div>

            <footer>

                <div id="copyright"
                     v-if="this.article.copyright">
                    <p>
                        Copyright &#169; {{this.article.author.firstName}} {{this.article.author.lastName}}.
                        <br>
                        All rights reserved.
                    </p>
                </div>

                <a id="download"
                   :title="'Download the Article: ' + article.title"
                   v-bind:href="this.article.downloadURL"
                   target="_blank">Download Article</a>

            </footer>
        </div>
    </main>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import { Route } from 'vue-router';
import { Article } from '@/types/types';
import APIService from '@/API';

@Component({
    components: {

    },
})

export default class TextArticle extends Vue {
    @Prop() private article: Article;
    @Prop() private mainTitleOffScreen: boolean;
    private $route: Route;
    private issueTitle: string;
    private drupalNodeID: string;


    constructor() {
        super();
    }

    // When view is mounted, retrieve article
    public async mounted() {
        // https://github.com/nuxt-community/typescript-template/issues/23

        // TODO: use publication to confirm or get article, currently arbitrary
        // e.g .../issue-2014/1 & ...issue-banana/1 will retrieve the same article
        this.issueTitle = this.$route.params.publication;
        this.drupalNodeID = this.$route.params.node;

        // if Article does not exist in current store variable of all articles
        // Then fetch article
        await APIService.fetchArticle(this.drupalNodeID)
            .then((response: Article) => {
                this.article = response;
                return response;
            });

        // Request article from store
        // Within store, if article does not exist and
        // API request returns 404, then show error message
        // this.api.getArticle(this.drupalNodeID)
        //     .then((article: ArticlePeerReviewed) => {
        //         this.article = article;
        //     })
        //     .catch(
        //         // reveal error message
        //     );
    }
}
</script>

<style lang="scss">
    $pageWidth: calc(50vw);
    $margin: calc(#{$pageWidth} / 8.5);
    $lefterWidth: 240px;
    $borderWidth: 3px;
    $activeMenuWidth: 20px;
    $fontSize: 17px;

    header {
        position: fixed;
        z-index: 2;
        width: calc(100% - #{$lefterWidth});
    }

    #text-article-view {
        font-family: 'Amiri', serif;
    }

    h1, h2, h3, h4, h5, h6 {
        font-weight: normal;
    }

    h1 {
        font-weight: normal;
    }

    h2 {
        font-weight: normal;
    }

    h3 {
        font-weight: normal;
    }

    h4 {
        font-size: 19px;
        margin: calc(-1 * #{$margin} / 4) 0 calc(#{$margin} / 4) 0;
    }

    h5 {
        font-weight: bold;
        text-transform: uppercase;
        font-size: calc(#{$fontSize} + 5px);
        text-indent: 0;
        margin: calc(#{$fontSize} * 4) 0 calc(#{$fontSize} * 2) 0;
        text-align: center;

    }

    h6 {
        width: calc(#{$pageWidth} / 2);
        font-size: 25px;
        margin: 25px auto;
        text-indent: 0;
        line-height: 125%;
        outline: 4px #000;
    }

    p {
        text-align: justify;
        font-size: 17px;
        line-height: 150%;
        margin-bottom: 6px;
        text-indent: 50px;
    }

    hr {
        margin: $margin;
    }

    blockquote {
        margin: calc(#{$margin} / 2.5) calc(#{$margin} / 1.5);
        font-weight: lighter;
    }

    blockquote p {
        text-indent: 0;
    }

    blockquote strong {
        font-weight: normal;
        font-size: calc(#{$fontSize} - 2px);
    }

    .tab {
        display:inline-block;
        width: 20px;
    }

    #active-submenu-spacer {
        width: calc(#{$activeMenuWidth} + #{$borderWidth});
        height: 100vh;
        display: inline-block;
        position: absolute;
        left: 0;
        top: 0;
    }

    #text-article {
        position: absolute;
        left: calc(#{$activeMenuWidth} + #{$borderWidth});
        top: 0;
        width: calc(100% - #{$activeMenuWidth} - #{$borderWidth});
        z-index: -1;
        margin-top: 15%;
    }

    .article-info {
        text-align: left;
        padding: 30px 0px 30px 20px;
    }

    #in-page-article-info {
        margin: 0 0 calc(#{$margin} / 1.5) 0;
    }

    .subtitle {
        margin-left: 30px;
    }

    .author {
        margin-top: 15px;
    }

    #article-page {
        width: $pageWidth;
        margin: 0 auto $margin auto;
        background: #fafafa;
        box-shadow: 3px 3px 8px 1px #d5d5d5;
    }

    #article {
        padding: $margin;
        text-align: left;
    }

    #abstract-title {
        // margin: calc(-1 * #{$margin} / 4) 0 calc(#{$margin} / 4) 0;
    }

    #bibliography {
        margin: $margin 0 0 0;
    }

    #bibliography p p {
        padding: 0 0 0 50px;
        text-indent: -50px;
        font-size: calc(#{$fontSize} - 3px);
        text-align: left;
    }

    footer {
        position: fixed;
        //left: $lefterWidth;
        bottom: 0;
        z-index: 2;
        width: calc(100% - calc(#{$lefterWidth} + #{$activeMenuWidth} + #{$borderWidth}));
    }

    footer #copyright {
        position: absolute;
        bottom: 0;
        left: 0;
        margin: 0 0 3px calc(#{$borderWidth} + 3px);
    }

    #copyright p {
        font-size: 12px;
        text-align: left;
        text-indent: 0;
        margin: 0;
    }

    .article-info:not(#in-page-article-info), footer #copyright {
        left: calc(#{$lefterWidth}+ #{$activeMenuWidth} + #{$borderWidth});
    }

    footer #download {
        position: absolute;
        right: 0;
        bottom: 0;
        padding: 3px 5px;
        margin: 0 15px 10px 0;
        text-decoration: underline;
        color: #1b4eff;
    }
</style>
