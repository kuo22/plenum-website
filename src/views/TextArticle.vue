<template>
    <main
        :v-show="article !== null"
        class="article"
    >
        <vue-headroom
            :z-index="3"
            :upTolerance="8"

            :class="{ 'headroom--hidden': hideHeadroom }"

            @onTop="isAtPageTop = true"
        >
            <header
                class="article__info article__info--headroom"

                @mouseover="headerHovered = true"
                @mouseleave="headerHovered = false"
            >
                <div
                    class="article__info-container article__info-container--headroom"
                    :class="{ 'article__info-container--hidden': isAtPageTop || scrollSessionFromTop }"
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
                </div >
            </header>
        </vue-headroom>

        <text-article-navigation
            :allVisible="isNavExposed"
            :previousArticle="article"
            :nextArticle="article"
        ></text-article-navigation>

        <div class="article__header">
            <div
                class="article__info article__info--embedded"
                :class="{ 'article__info--embedded--hidden': hideArticleContents }"
            >
                <div
                    class="article__info-container article__info-container--embedded"
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
            </div>
        </div>
        <div
            id="article-frame"
            class="article__frame"
        >
            <div
                v-view="onEarlyScroll"
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

                <hr v-view="onPresenceOfBiblio">

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
import TextArticleNavigation from '@/components/TextArticleNavigation';

@Component({
    components: {
        headroom,
        TextArticleNavigation,
    },
})

export default class TextArticle extends Vue {
    // TODO: clean up headroom visibility
    // TODO: clean up footer and header css
    // TODO: consider creating a footer (and maybe header) component?

    @Prop() private mainTitleOffScreen: boolean;

    // Children props

    // Internal data
    private articleLoading: boolean;
    private article: Article;
    private articleError: boolean;

    private headerHovered: boolean;
    private footerHovered: boolean;

    private isAtPageTop: boolean;
    private inStartThreshold: boolean;
    private isNearPageBottom: boolean;

    private lastPercentCenter: number;
    private maxPercentCenter: number;

    private hideHeadroom: boolean;
    private scrollSessionFromTop: boolean;

    private $route: Route;

    constructor() {
        super();
        this.articleLoading = false;
        this.article = null;
        this.articleError = null;

        this.headerHovered = false;
        this.footerHovered = false;

        this.isAtPageTop = true;
        this.inStartThreshold = true;
        this.isNearPageBottom = false;

        this.lastPercentCenter = -1;
        this.maxPercentCenter = this.lastPercentCenter;

        this.hideHeadroom = true;
        this.scrollSessionFromTop = true;
    }

    // When view is mounted, retrieve article
    public created() {
        this.fetchArticle();
    }

    //
    get hideArticleContents() {
        return !(this.isAtPageTop || this.hideHeadroom);
    }

    get isNavExposed() {
        // this.isAtPageTop || this.hideHeadroom ||
        return this.isNearPageBottom;
    }

    @Watch('$route')
    private onRouteChanged(val, oldVal) {
        this.fetchArticle();
    }

    //
    private onEarlyScroll(e): void {
        // If at top of page
        if (e.percentCenter === this.maxPercentCenter) {
            this.isAtPageTop = true;
            this.scrollSessionFromTop = true;
        } else {
            this.isAtPageTop = false;
        }

        // Set whether or not the headroom should be hidden
        if (e.type === 'exit') {
            this.hideHeadroom = false;
            this.scrollSessionFromTop = false;
        } else if (e.percentCenter < this.lastPercentCenter) { // Scrolling down
            this.hideHeadroom = this.scrollSessionFromTop;
        } else if (e.percentCenter > this.lastPercentCenter) { // Scrolling up
            // Filler
        } else {
            this.scrollSessionFromTop = true;
        }

        this.lastPercentCenter = e.percentCenter;
        if (this.lastPercentCenter > this.maxPercentCenter) {
            this.maxPercentCenter = this.lastPercentCenter;
        }
    }

    //
    private onPresenceOfBiblio(e): void {
        if (e.percentTop > 0.5) {
            if (e.type === 'enter') {
                this.isNearPageBottom = true;
            } else if (e.type === 'exit') {
                this.isNearPageBottom = false;
            }
        }
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
    $pageWidth: 50vw;
    $margin: calc(#{$pageWidth} / 8.5);
    $lefterWidth: 240px;
    $borderWidth: 3px;
    $activeMenuWidth: 20px;
    $fontSize: 17px;

    .article {
        overflow-x: initial;
        font-family: 'Amiri', serif;
    }

    .article__header {
        position: relative;
        width: 100%;
        height: $lefterWidth;
    }

    .article__info {
        position: fixed;
        top: 0;
        left: calc(#{$lefterWidth} + 3px);
        height: $lefterWidth;
        margin-left: 30px;

        z-index: 2;

        text-align: left;
        font-weight: normal;
    }

    .article__info--embedded {
        position: relative;
        left: 0;
        height: 240px;
        z-index: 1;
        outline: 3px solid transparent;
    }

    .article__info--embedded--hidden {
        visibility: hidden;
    }

    .article__info-container {
        position: relative;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        padding: 20px;
        z-index: -1;

        background: white;
    }

    .article__info-container--headroom {
        box-shadow: 8px 8px 10px 2px #00000029;
    }

    .article__info-container--embedded {
        margin-left: 3px;
    }

    .article__info-container--outlined {
        outline: 3px solid black;
    }

    .article__info-container--hidden {
        background: transparent;

        opacity: 0;
        transition: opacity 150ms ease;
    }

    .article__info-container--hidden * {
        visibility: hidden;
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
        margin-top: calc(240px * 0.5);

        text-align: left;
    }

    .article__page {
        width: calc(#{$pageWidth} - 10vw);
        padding: 5vw;
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
        z-index: 3;
    }

    .footer__menu {
        position: absolute;
        left: 0;
        bottom: 0 !important;
        width: calc(100% - 2 * 10vw);
        height: 100%;
        padding: 0 10vw;
        z-index: -1;

        outline: 3px solid black;

        background: white;
    }

    .footer__copyright {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        height: 5vh;
        margin: auto auto auto calc(3px + 3px);
    }

    .footer__copyright p {
        position: relative;
        top: 50%;
        transform: translateY(-50%);
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
        margin: auto;
        padding: 0.5em 0.8em;

        color: #1b4eff;

        font-size: 1.2em;
        text-decoration: underline;
    }

    .footer__download-button * {
        line-height: 5vh; // Same as parent
    }

    /* HEADROOM */

    .headroom {
        height: 240px;
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

    .headroom--hidden {
        display: none;
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
    }
    .footer-slide-enter-active {
        transition: all 250ms;
    }
    .footer-slide-leave-active {
        transition: all 250ms;
    }
    .footer-slide-leave-to {
        transform: translate3d(0px, calc(100% + 3px), 0px);
    }


    /* STYLING FOR INSERTED HTML FROM DRUPAL */

    h4 {
        margin: calc(-1 * #{$margin} / 4) 0 calc(#{$margin} / 4) 0;
        font-size: 19px;
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
