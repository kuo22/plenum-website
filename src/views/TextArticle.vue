<template>
    <main
        :v-show="article !== null && article !== undefined"
        v-if="article"
        class="article-view"
    >
        <transition name="header-title-fade">
            <vue-headroom
                :z-index="3"
                :upTolerance="8"
                :classes="{
                    initial : 'article-headroom',
                    pinned : 'article-headroom--pinned',
                    unpinned : 'article-headroom--unpinned',
                    top : 'article-headroom--top',
                    notTop : 'article-headroom--not-top',
                    bottom : 'article-headroom--bottom',
                    notBottom : 'article-headroom--not-bottom'
                }"

                :class="{ 'article-headroom--hidden': false && hideHeadroom }"

                @onTop="isAtPageTop = true"
            >
                <header
                    class="header header--headroom"
                    role="presentation"
                >
                    <text-article-title-card
                        v-if="article"
                        class="header-container header-container--headroom"
                        :title="article.content_title"
                        :subtitle="article.subtitle"
                        :author="(typeof article.authors === 'string') ? article.authors : article.authors.join(' | ')"
                        :hidden="isAtPageTop || scrollSessionFromTop"
                    ></text-article-title-card>
                </header>
            </vue-headroom>
        </transition>

        <article>
            <header
                class="header header--embedded"
                :class="{ 'header--embedded--hidden': !(this.isAtPageTop || this.hideHeadroom) }"
            >
                <text-article-title-card
                    v-if="article"
                    class="header-container header-container--embedded"

                    :title="article.content_title"
                    :subtitle="article.subtitle"
                    :author="(typeof article.authors === 'string') ? article.authors : article.authors.join(' | ')"
                ></text-article-title-card>
            </header>

            <div
                v-view="handleArticlePageInView"
                class="article__page"
            >
                <section
                    v-if="article.abstract"
                    class="article__abstract"
                >
                    <h2 id="article__abstract-title">ABSTRACT</h2>
                    <p>
                        {{ article.abstract }}
                    </p>
                </section>

                <hr v-if="article.abstract" class="section-divider">

                <div class="article__body">
                    <section
                        v-for="section in article.article_section || article.body"
                        v-html="section.processed"
                    ></section>
                </div>

                <hr
                    v-if="article.references"
                    v-view="handleBiblioInView"

                    class="section-divider"
                >

                <section
                    v-if="article.references"
                    class="article__biblio"
                >
                    <h2>BIBLIOGRAPHY</h2>

                    <p v-html="article.references.processed"></p>
                </section>
            </div>

            <footer
                v-if="article"
                class="footer"
                role="contentinfo"
            >
                <div
                    v-if="article.copyright"
                    class="footer__copyright"
                >
                    <p>
                        Copyright &#169; {{ authorCopyrightFormat }}
                        <br>
                        All rights reserved.
                    </p>
                </div>
            </footer>
        </article>
    </main>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import headroom from 'vue-headroom';
import { Route } from 'vue-router';
import APIService from '@/lib/api';
import TextArticleNavigation from '@/components/TextArticleNavigation';
import TextArticleTitleCard from '../components/TextArticleTitleCard';

@Component({
    components: {
        headroom,
        TextArticleNavigation,
        TextArticleTitleCard,
    },
})

// Text Article, Drupal Content Type, Component
export default class TextArticle extends Vue {
    private articleLoading: boolean;
    private article: any;
    private articleError: boolean;

    private isAtPageTop: boolean;
    private isBiblioInView: boolean;

    private lastPercentCenter: number;
    private maxPercentCenter: number;

    private hideHeadroom: boolean;
    private scrollSessionFromTop: boolean;

    private $route: Route;

    constructor() {
        super();

        this.articleLoading = false;
        this.article = {
            title: '',
            subtitle: '',
            author: ''
        };
        this.articleError = false;

        this.isAtPageTop = true; // Scroll position is at the top of the page (pos: 0)
        this.isBiblioInView = false; // Bibliography is in the viewport

        this.lastPercentCenter = -1;
        this.maxPercentCenter = this.lastPercentCenter;

        this.hideHeadroom = true;
        this.scrollSessionFromTop = true;
    }

    @Watch('$route')
    private onRouteChanged(val, oldVal) {
        this.fetchArticle();
    }

    // When view is mounted, retrieve article
    private mounted() {
        this.fetchArticle();
    }

    // Returns the author(s) of the article in a format depending on the number of author
    // e.g. 'McClung J.' for a single author or 'Deremer, E. et al.' for multiple authors
    private get authorCopyrightFormat(): string {
        let singleAuthor = (typeof this.article.authors === 'string') ? this.article.authors : this.article.authors[0];
        singleAuthor = singleAuthor.split(' ').reverse().join(', ');
        singleAuthor = singleAuthor.substring(0, singleAuthor.indexOf(', ') + 3) + ".";
        singleAuthor += (typeof this.article.authors === 'string') ? "" : " et al.";
        return singleAuthor;
    }

    // TODO: make global for any component that needs to access images in '/assets/
    // Returns the post-compilation relative path of the provided image
    // Currently hard-coded to .png
    private getImageSource(fileName: string): string {
        const image = require.context('../assets/', false, /\.png$/);
        return image('./' + fileName + '.png');
    }

    // Sets variables to control the visibility of the headroom
    // Sorry for bad description...
    private handleArticlePageInView(e): void {
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

    // When bibliography is in view, set the data to be representative
    private handleBiblioInView(e): void {
        if (e.percentTop > 0.5) {
            if (e.type === 'enter') {
                this.isBiblioInView = true;
            } else if (e.type === 'exit') {
                this.isBiblioInView = false;
            }
        }
    }

    // Gets article data depending on the URL
    // If the article data doesn't exist in the store, fetch the article via the Api
    // and then store the article in the store
    private async fetchArticle() {
        this.articleError = this.article = null;
        this.articleLoading = true;

        const uuid = this.$route.params.id;
        const contentType = this.$route.params.content_type;

        let temp = this.$store.getters['issues/getArticleByUUID'](uuid);
        if (temp !== undefined && temp.length > 0) {
            this.article = temp;

            this.articleLoading = false;
            this.articleError = false;
        } else {
            this.article = await APIService.fetchContentByUUID(uuid, contentType)
                .then(article => {
                    article.authors = article.authors.split(';').map(author => {
                        return author.trim().split(',').reverse().join(' ').trim();
                    });
                    this.$store.dispatch('issues/addArticle', article);
                    this.articleLoading = false;
                    return article;
                })
                .catch(err => {
                    this.articleError = true;
                    this.articleLoading = false;
                    console.error(err);
                });
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "../styles/_settings";
    @import "../styles/drupal-content";
    
    $pageWidth: 60vw;
    $pageMargin: calc(#{$pageWidth} / 8.5);

    .article-view {
        padding-top: 0;
        font-family: 'Amiri', serif;
    }

    .section-divider {
        margin: $pageMargin;
        border-width: 2px;
        border-color: #fafafa;
    }

    .header {
        position: relative;
        top: 0;
        left: $navBarWidth;
        height: $navBarWidth;
        margin-left: 30px;

        z-index: 2;

        text-align: left;
        font-weight: normal;
    }

    .header--embedded {
        position: relative;
        left: 0;
        height: $navBarWidth;
        z-index: 1;
        outline: 3px solid transparent;
    }

    .header--embedded--hidden {
        visibility: hidden;
    }

    .article-headroom {
        height: calc(#{$navBarWidth} + 60px);
    }

    .header--headroom {
        left: calc(#{$lefterWidth} * 1.5) !important;
    }

    .header-container {
        top: 50%;
        transform: translateY(-50%);
        padding: 20px;
        z-index: -1; // To hide behind headroom header

        background: white;
    }

    .header-container--embedded {
        box-shadow: 0 0 0 0 transparent !important;
    }

    /* ARTICLE CONTENT BELOW TITLES */
    .article__page {
        width: calc(#{$pageWidth} - 10vw);
        max-width: 850px;

        padding: 5vw;
        margin: $headerHeight auto $pageMargin auto;
        //margin: 0 auto $pageMargin auto;

        background: #fafafa;

        box-shadow: 3px 3px 8px 1px #d5d5d5;

        text-align: left;
    }

    .article__biblio {
        margin: $pageMargin 0 0 0;
    }

    // TODO: move to drupal-content SCSS file?
    .article__biblio /deep/ > p > p {
        padding: 0 0 0 50px;

        text-indent: -50px;
        text-align: left;
    }

    .footer {
        position: fixed;
        left: 0;
        bottom: 0;
        width: $navBarWidth * 1.5;
        height: $footerHeight;
        z-index: 4;
    }

    .footer__menu {
        position: absolute;
        left: 0;
        bottom: 0 !important;
        width: calc(100% - 2 * 10vw);
        height: 100%;
        padding: 0 10vw;
        z-index: -1;

        background: white;

        outline: 3px solid black;
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

        font-size: 1em;
        line-height: 1.4em;
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

    /*******************/
    /* HEADROOM STATES */
    /*******************/

    .article-headroom {
    }
    .article-headroom--not-top.article-headroom--pinned {
    }
    .article-headroom--unpinned {
    }
    .article-headroom--top {
    }
    .article-headroom--not-top {
    }
    .article-headroom--bottom {
    }
    .article-headroom--not-bottom {
    }

    .article-headroom--hidden {
        display: none;
    }

    /***************/
    /* TRANSITIONS */
    /***************/

    /* HEADER-SLIDE */

    .header-slide-enter,
    .header-slide-leave-to {
        transform: translateY(calc(-1 * 100%));
    }
    .header-slide-enter-active {
        transition: all 0.2s ease;
    }
    .header-slide-leave-active {
        transition: all 0.3s ease;
    }

    /* HEADER-TITLE-FADE */

    .header-title-fade-enter,
    .header-title-fade-leave-to {
        opacity: 0;
    }
    .header-title-fade-enter-active {
        transition: opacity 150ms ease;
    }
    .header-title-fade-enter-to,
    .header-title-fade-leave {
        opacity: 1;
    }
    .header-title-fade-leave-active {
        transition: opacity 250ms ease;
    }
</style>
