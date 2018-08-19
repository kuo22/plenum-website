<template>
    <main
        :v-if="article"
        class="article"
    >
        <header class="article__info">
            <div>
                <h1 class="article__title">
                    {{ article.title }}
                </h1>
                <h2 class="article__subtitle">
                    {{  article.subtitle }}
                </h2>
            </div>
            <h3 class="article__author">
                <em>
                    {{ article.author.firstName }} {{ article.author.lastName }}
                </em>
            </h3>
        </header>
        <div class="article__frame">
            <div class="article__page">
                <div class="article__abstract">
                    <h4 id="article__abstract-title">ABSTRACT</h4>
                    <p>
                        {{ article.abstract }}
                    </p>
                </div>

                <hr>

                <div class="article__body">
                    <p v-html="article.body"></p>
                </div>

                <hr>

                <div class="article__biblio">
                    <h4>BIBLIOGRAPHY</h4>

                    <p v-html="article.refs"></p>
                </div>
            </div>

            <footer>

                <div
                    v-if="article.copyright"
                    class="article__copyright"
                >
                    <p>
                        Copyright &#169; {{ article.author.firstName }} {{ article.author.lastName }}.
                        <br>
                        All rights reserved.
                    </p>
                </div>

                <a
                    class="article__download-button"
                    :title="'Download the Article: ' + article.title"
                    :href="article.downloadURL"
                    target="_blank"
                >
                    Download Article
                </a>

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
    @Prop() private mainTitleOffScreen: boolean;

    private articleLoading: boolean = false;
    private article: Article = null;
    private articleError: boolean = null;

    private $route: Route;
    // private issueTitle: string = this.$route.params.publication;


    constructor() {
        super();
    }

    // When view is mounted, retrieve article
    public created() {
        this.fetchArticle();
    }

    @Watch('$route')
    private onRouteChanged(val, oldVal) {
        this.fetchArticle();
    }

    //
    private fetchArticle() {
        this.articleError = this.article = null;
        this.articleLoading = true;

        // https://github.com/nuxt-community/typescript-template/issues/23

        // TODO: use publication to confirm or get article, currently arbitrary
        // e.g .../issue-2014/1 & ...issue-banana/1 will retrieve the same article

        const drupalNodeID = this.$route.params.node;

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

        // if Article does not exist in current store variable of all articles
        // Then fetch article
        APIService.fetchArticle(drupalNodeID)
            .then((response: Article) => {
                this.article = response;
                return response;
            }).catch((error) => {
                // TODO: plan for error
                this.articleError = error.toString();
            });
    }
}
</script>

<style lang="scss" scoped>
    $pageWidth: calc(50vw);
    $margin: calc(#{$pageWidth} / 8.5);
    $lefterWidth: 240px;
    $borderWidth: 3px;
    $activeMenuWidth: 20px;
    $fontSize: 17px;

    .article {
        overflow-x: initial;
        font-family: 'Amiri', serif;
    }

    .article__info {
        position: fixed;
        width: calc(100% - #{$lefterWidth});
        padding: 30px 0px 30px 20px;

        z-index: 2;

        text-align: left;
        font-weight: normal;
    }

    .article__subtitle {
        margin-left: 30px;
    }

    .article__author {
        margin-top: 15px;
    }

    .article__title,
    .article__subtitle,
    .article__author {
        font-weight: normal;
    }

    /* ARTICLE CONTENT BELOW TITLES */
    .article__frame {
        margin-top: 15%;
        padding: $margin;

        text-align: left;
    }

    .article__page {
        width: $pageWidth;
        margin: 0 auto $margin auto;

        box-shadow: 3px 3px 8px 1px #d5d5d5;

        background: #fafafa;
    }

    .article__biblio {
        margin: $margin 0 0 0;
    }

    .article__biblio p p {
        padding: 0 0 0 50px;

        text-indent: -50px;
        font-size: calc(#{$fontSize} - 3px);
        text-align: left;
    }

    footer {
        position: fixed;
        bottom: 0;
        width: calc(100% - calc(#{$lefterWidth} + #{$activeMenuWidth} + #{$borderWidth}));
        z-index: 2;
    }

    .article__copyright {
        position: absolute;
        bottom: 0;
        left: 0;
        margin: 0 0 3px calc(#{$borderWidth} + 3px);
    }

    .article__copyright p {
        margin: 0;

        font-size: 12px;
        text-align: left;
        text-indent: 0;
    }

    // Good if the menu is active and pushed out 20 px
    .article__info:not(#in-page-article__info), .article__copyright {
        left: calc(#{$lefterWidth} + #{$activeMenuWidth} + #{$borderWidth});
    }

    .article__download-button {
        position: absolute;
        right: 0;
        bottom: 0;
        margin: 0 15px 10px 0;
        padding: 3px 5px;

        color: #1b4eff;

        text-decoration: underline;
    }

    /* STYLING FOR INSERTED HTML FROM DRUPAL */

    h4 {
        font-size: 19px;
        margin: calc(-1 * #{$margin} / 4) 0 calc(#{$margin} / 4) 0;
    }

    h5 {
        margin: calc(#{$fontSize} * 4) 0 calc(#{$fontSize} * 2) 0;

        font-weight: bold;
        text-transform: uppercase;
        font-size: calc(#{$fontSize} + 5px);
        text-indent: 0;
        text-align: center;
    }

    h6 {
        width: calc(#{$pageWidth} / 2);
        margin: 25px auto;

        outline: 4px #000;

        font-size: 25px;
        text-indent: 0;
        line-height: 125%;
    }

    p {
        margin-bottom: 6px;

        text-align: justify;
        font-size: 17px;
        line-height: 150%;
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
</style>
