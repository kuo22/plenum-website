<template>
    <main
        :v-if="article"
        class="article"
    >
        <vue-headroom
            :z-index="3"
            :upTolerance="15"
        >
            <header
                class="article__info"

                @mouseover="headerHovered = true"
                @mouseleave="headerHovered = false"
            >
                <transition name="header-slide">
                    <div
                        class="article__info-container"
                        :class="{ 'article__info-container--outlined': outlinedHeader }"
                    >
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
                    </div>
                </transition>
            </header>
        </vue-headroom>
        <div
            id="article-frame"
            class="article__frame"
        >
            <div
                v-view="startOfArticle"
                class="article__page"
            >
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

                <hr v-view="endOfArticleReached">

                <div
                    class="article__biblio"
                >
                    <h4>BIBLIOGRAPHY</h4>

                    <p v-html="article.refs"></p>
                </div>
            </div>
        </div>
        <footer
            class="footer"
            @mouseover="footerHovered = true"
            @mouseleave="footerHovered = false"
        >
            <transition name="footer-slide">
                <ul
                    v-show="footerHovered || endOfArticleFlag || startOfArticleFlag"
                    role="menubar"
                    class="footer__menu"
                >
                    <li>
                        <a>Test</a>
                    </li>
                </ul>
            </transition>
            <div
                v-if="article.copyright"
                class="footer__copyright"
            >
                <p>
                    Copyright &#169; {{ article.author.firstName }} {{ article.author.lastName }}.
                    <br>
                    All rights reserved.
                </p>
            </div>

            <a
                class="footer__download-button"
                :title="'Download the Article: ' + article.title"
                :href="article.downloadURL"
                target="_blank"

                tabindex="0"
            >
                <span tabindex="-1">Download Article</span>
            </a>

        </footer>
    </main>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import headroom from 'vue-headroom';
import { Route } from 'vue-router';
import { Article } from '@/types/types';
import APIService from '@/API';

@Component({
    components: {
        headroom,
    },
})

export default class TextArticle extends Vue {
    @Prop() private mainTitleOffScreen: boolean;

    private articleLoading: boolean;
    private article: Article;
    private articleError: boolean;

    private headerHovered: boolean;
    private footerHovered: boolean;

    private startOfArticleFlag: boolean;
    private endOfArticleFlag: boolean;

    private bodyScrollPosition: number;

    private outlinedHeader: boolean;

    private $route: Route;

    constructor() {
        super();
        this.articleLoading = false;
        this.article = null;
        this.articleError = null;

        this.headerHovered = false;
        this.footerHovered = false;

        this.startOfArticleFlag = true;
        this.endOfArticleFlag = false;

        this.bodyScrollPosition = 0;

        this.outlinedHeader = false;
    }

    // When view is mounted, retrieve article
    public created() {
        this.fetchArticle();
    }

    private startOfArticle(e): void {
        if (e.scrollPercent < 0.008) {
            this.startOfArticleFlag = true;
        } else {
            this.startOfArticleFlag = false;
        }
        if (e.type === 'exit') {
            this.outlinedHeader = true;
        } else {
            this.outlinedHeader = false;
        }
    }

    private endOfArticleReached(e): void {
        if (e.percentTop > 0.5) {
            if (e.type === 'enter') {
                this.endOfArticleFlag = true;
            } else if (e.type === 'exit') {
                this.endOfArticleFlag = false;
            }
        }
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
        width: calc(100% - #{$lefterWidth} - 20px);
        height: 16vh;
        left: calc(#{$lefterWidth} + 3px) !important;
        padding: 30px 0 30px 20px;

        z-index: 2;

        text-align: left;
        font-weight: normal;
    }

    .article__info-container {
        position: absolute;
        top: 0 !important;
        left: 0;
        width: calc(100% - 40px);
        height: calc(100% - 40px);
        padding: 20px;
        z-index: -1;

        background: white;
    }

    .article__info-container--outlined {
        outline: 3px solid black;
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

    .footer {
        position: fixed;
        bottom: 0;
        width: calc(100% - calc(#{$lefterWidth}));
        height: 6vh;
        z-index: 2;
    }

    .footer__menu {
        position: absolute;
        bottom: 0 !important;
        left: 0;
        width: calc(100% - 2 * 10vw);
        height: 100%;
        padding: 0 10vw;
        z-index: -1;

        outline: 3px solid black;

        background: white;
    }

    .footer__copyright {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        height: 5vh;
        margin: auto;
        margin-left: calc(3px + 3px);
    }

    .footer__copyright p {
        margin: 0;

        font-size: 12px;
        text-align: left;
        text-indent: 0;
    }

    .footer__download-button {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        height: 5vh;
        //margin: auto 15px 10px auto;
        padding: 5px 8px;

        color: #1b4eff;

        text-decoration: underline;
    }

    /* HEADROOM */

    .headroom {
        height: calc(16vh + 60px + 3px);
    }
    .headroom--pinned {
    }
    .headroom--unpinned {
    }
    .headroom--top {
    }
    .headroom--not-top {
    }
    .headroom--bottom {
    }
    .headroom--not-bottom {
    }

    /* TRANSITIONS */

    .header-slide-enter {
        transform: translateY(calc(-1 * 100%));
    }
    .header-slide-enter-active {
        transition: all 0.2s ease;
    }
    .header-slide-leave-active {
        transition: all 0.3s ease;
    }
    .header-slide-leave-to {
        transform: translateY(calc(-1 * 100%));
    }

    .footer-slide-enter {
        transform: translate3d(0px, calc(100% + 3px), 0px);
        //transform: translateY(calc(6vh + 3px));
    }
    .footer-slide-enter-active {
        transition: all 250ms;
        //transition: all 0.2s ease;
    }
    .footer-slide-leave-active {
        transition: all 250ms;
        //transition: all 0.3s ease;
    }
    .footer-slide-leave-to {
        transform: translate3d(0px, calc(100% + 3px), 0px);
        //transform: translateY(calc(6vh + 3px));
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
