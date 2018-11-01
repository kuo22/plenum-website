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

                    @mouseover="headerHovered = true"
                    @mouseleave="headerHovered = false"
                >
                    <text-article-title-card
                        v-if="article"
                        class="header-container header-container--headroom"
                        :title="article.title"
                        :subtitle="article.subtitle"
                        :author="(typeof article.author === 'string') ? article.author : article.author.join(' | ')"
                        :hideTitleCard="isAtPageTop || scrollSessionFromTop"
                    ></text-article-title-card>
                </header>
            </vue-headroom>
        </transition>

        <article>
            <header
                class="header header--embedded"
                :class="{ 'header--embedded--hidden': hideArticleContents }"
            >
                <transition name="header-title-fade">
                    <text-article-title-card
                            v-if="article"
                            class="header-container header-container--embedded"

                            :title="article.title"
                            :subtitle="article.subtitle"
                            :author="(typeof article.author === 'string') ? article.author : article.author.join(' | ')"
                    ></text-article-title-card>
                </transition>
            </header>

                <div
                    v-view="onEarlyScroll"
                    class="article__page"
                    :style="articleLoading ? {background: 'url(' + getImageSource('loading-background-tile') + ')', 'background-size': '28px 30px'} : null"
                >
                    <!-- TODO: render article page with 'loading background' while article is loading -->
                    <section
                        v-if="article.abstract"
                        class="article__abstract"
                    >
                        <h2 id="article__abstract-title">ABSTRACT</h2>
                        <p>
                            {{ article.abstract }}
                        </p>
                    </section>

                    <hr class="section-divider" v-if="article.abstract">

                    <div class="article__body">
                        <section
                            v-for="section in article.body"
                            v-html="section.processed"
                        >
                        </section>

                    </div>

                    <hr
                        v-if="article.references"
                        v-view="onPresenceOfBiblio"

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

                @mouseover="footerHovered = true"
                @mouseleave="footerHovered = false"
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

                <!--a
                    class="footer__download-button"
                    :title="'Download the Article, ' + article.title + ', as a PDF.'"
                    :href="article.downloadURL"
                    target="_blank"

                    tabindex="0"
                >
                    <span tabindex="-1">Download Article</span>
                </a-->
            </footer>
        </article>

        <!-- :allVisible="isNavExposed"-->
        <!--text-article-navigation
                v-if="article"
                :allVisible="isNavExposed"
                :previousArticle="article"
                :nextArticle="article"
                @navArrowHovered="navArrowHovered = true"
                @navArrowUnhovered="navArrowHovered = false"
        ></text-article-navigation-->
    </main>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import headroom from 'vue-headroom';
import { Route } from 'vue-router';
import APIService from '@/API';
import TextArticleNavigation from '@/components/TextArticleNavigation';
import TextArticleTitleCard from '../components/TextArticleTitleCard';

@Component({
    components: {
        headroom,
        TextArticleNavigation,
        TextArticleTitleCard,
    },
})

export default class TextArticle extends Vue {
    // Internal data
    private articleLoading: boolean;
    private article: any;
    private articleError: boolean;

    private issue: any;
    private issuePosition: number; // index of current article within issue

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
        this.article = {
            title: '',
            subtitle: '',
            author: ''
        };
        this.articleError = false;

        this.issue = null;
        this.issuePosition = -1;

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

    @Watch('$route')
    private onRouteChanged(val, oldVal) {
        this.fetchArticle();
    }

    // When view is mounted, retrieve article
    private mounted() {
        this.fetchArticle();
    }

    private get authorCopyrightFormat(): string {
        let singleAuthor = (typeof this.article.author === 'string') ? this.article.author : this.article.author[0];
        singleAuthor = singleAuthor.split(' ').reverse().join(', ');
        singleAuthor = singleAuthor.substring(0, singleAuthor.indexOf(', ') + 3) + ".";
        singleAuthor += (typeof this.article.author === 'string') ? "" : " et al.";
        return singleAuthor;
    }

    //
    get hideArticleContents() {
        return !(this.isAtPageTop || this.hideHeadroom);
    }

    get isNavExposed() {
        // this.isAtPageTop || this.hideHeadroom ||
        return this.isNearPageBottom;
    }

    // TODO: make global for any component that needs to access images in '/assets/
    private getImageSource(fileName: string): string {
        const image = require.context('../assets/', false, /\.png$/);
        return image('./' + fileName + '.png');
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
    private async fetchArticle() {
        this.articleError = this.article = null;
        this.articleLoading = true;

        const uuid = this.$route.params.id;
        const contentType = this.$route.params.content_type;

        let temp = this.$store.getters['issues/getArticleByUUID'](uuid);
        if (temp !== undefined && temp.length > 0) {
            this.article = temp;
            //this.issue = ;
            //this.issuePosition = ;

            this.articleLoading = false;
            this.articleError = false;
        } else {
            this.article = await APIService.fetchContentByUUID(uuid, contentType)
                .then(article => {
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
    $margin: calc(#{$pageWidth} / 8.5);
    $activeMenuWidth: 20px;
    $fontSize: 17px;

    .article-view {
        padding-top: 0;
        font-family: 'Amiri', serif;
    }

    .section-divider {
        margin: $margin;
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
        margin: $headerHeight auto $margin auto;
        //margin: 0 auto $margin auto;

        background: #fafafa;

        box-shadow: 3px 3px 8px 1px #d5d5d5;

        text-align: left;
    }

    .article__biblio {
        margin: $margin 0 0 0;
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

    /* HEADROOM STATES */

    .article-headroom {
        //height: 240px;
    }
    .article-headroom--not-top.article-headroom--pinned {
        //box-shadow: 8px 8px 10px 2px #00000029;
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

    .header-title-fade-enter {
        opacity: 0;
    }
    .header-title-fade-enter-active {
        transition: opacity 150ms ease;
    }
    .header-title-fade-enter-to {
        opacity: 1;
    }
    .header-title-fade-leave {
        opacity: 1;
    }
    .header-title-fade-leave-active {
        transition: opacity 250ms ease;
    }
    .header-title-fade-leave-to {
        opacity: 0;
    }
</style>
