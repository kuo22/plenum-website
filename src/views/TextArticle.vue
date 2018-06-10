<template>
    <div id="text-article-view">
        <span id="active-submenu-spacer"></span>
        <div id="text-article">
            <div class="article-info">
                <div class="titles">
                    <h1 class="title">
                        {{this.article.title}}
                    </h1>
                    <h2 class="subtitle">
                        {{this.article.subtitle}}
                    </h2>
                </div>
                <h3 class="author">
                    <i>{{this.article.author}}</i>
                </h3>
            </div>

            <div id="article-page">
                <div id="article">
                    <div id="abstract">
                        <h4 id="abstract-title">ABSTRACT</h4>
                        <!--span class="tab"></span-->
                        <p>
                            {{this.article.abstract}}
                        </p>
                        <hr>
                    </div>

                    <div id="in-page-article-info" class="article-info">
                        <div class="titles">
                            <h1 class="title">
                                {{this.article.title}}
                            </h1>
                            <h2 class="subtitle">
                                {{this.article.subtitle}}
                            </h2>
                        </div>
                        <h3 class="author">
                            <i>{{this.article.author}}</i>
                        </h3>
                    </div>

                    <div id="article-body">
                        <p v-html="this.article.body"></p>
                    </div>
                </div>
            </div>
            <footer>
                <div id="copyright"
                     v-if="this.article.copyright">
                    <p>
                        Copyright &#169; {{this.article.author}}.
                        <br>
                        All rights reserved.
                    </p>
                </div>
                <a id="download"
                   v-bind:href="this.article.downloadURL"
                   target="_blank">Download Article</a>
            </footer>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import { Route } from 'vue-router';
import { ArticlePeerReviewed } from '@/classes/ArticlePeerReviewed';

@Component({
    components: {

    },
})

export default class Article extends Vue {
    @Prop() private article: ArticlePeerReviewed;
    @Prop() private mainTitleOffScreen: boolean;
    private $route: Route;
    private year: string;
    private articleId: number;

    constructor() {
        super();


    }

    public mounted() {
        // https://github.com/nuxt-community/typescript-template/issues/23
        this.year = this.$route.params.id;
        this.articleId = this.$route.params.article_id - 1;

        this.getArticle(this.year, this.articleId);
    }

    private getArticle(year: string, articleId: number) {
        const articleJSON = fetch('http://localhost:8888/plenum-drupal-dev/drupal-8.5.3/api/pubs/'
            + this.year
            + '?_format=json')
            .then((response) =>
                response.json().then((data) => ({
                    data,
                    status: response.status,
                }),
                ).then((res) => {
                    this.parseData(res.data[this.articleId]);
                }))
            .catch();
        // Throw DOM display that article does not exist
    }

    private parseData(data) {
        this.article = new ArticlePeerReviewed(
            data.field_title[0].value, // Title
            data.field_author[0].value, // Author
            data.field_abstract[0].value, // Abstract
            data.body[this.articleId].processed, // Text body
            data.field_download_[0].url, // Download URL
            data.field_copyright[0].value,
            'University of Washington', // University
            'Department of Geography', // School
            data.field_subtitle[0].value, // Subtitle
        );
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

    #text-article-view {
        font-family: 'PT Serif', serif;
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
    }

    .article-info {
        text-align: left;
        margin: 30px 0px 30px 20px;
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
        margin: calc(-1 * #{$margin} / 4) 0 calc(#{$margin} / 4) 0;
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
        margin: 0 15px 10px 0;
        text-decoration: underline;
        color: #0079ff;
    }
</style>
