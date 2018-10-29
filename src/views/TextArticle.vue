<template>
    <main
        :v-show="article !== null && article !== undefined"
        v-if="article"
        class="article"
    >
        <transition name="header-title-fade">
            <vue-headroom
                v-show="!navArrowHovered"
                :z-index="3"
                :upTolerance="8"

                :class="{ 'headroom--hidden': hideHeadroom }"

                @onTop="isAtPageTop = true"
            >
                <header
                    class="article__info article__info--headroom"
                    role="presentation"

                    @mouseover="headerHovered = true"
                    @mouseleave="headerHovered = false"
                >
                    <text-article-title-card
                        v-if="article"
                        class="article__info-container article__info-container--headroom"
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
                class="article__info article__header article__info--embedded"
                :class="{ 'article__info--embedded--hidden': hideArticleContents }"
            >
                <transition name="header-title-fade">
                    <text-article-title-card
                            v-if="article"
                            v-show="!navArrowHovered"
                            class="article__info-container article__info-container--embedded"

                            :title="article.title"
                            :subtitle="article.subtitle"
                            :author="(typeof article.author === 'string') ? article.author : article.author.join(' | ')"
                    ></text-article-title-card>
                </transition>
            </header>

            <div
                id="article-frame"
                class="article__frame"
            >
                <div
                    v-view="onEarlyScroll"
                    class="article__page"
                    :style="articleLoading ? {background: 'url(' + getImageSource('loading-background-tile') + ')', 'background-size': '28px 30px'} : null"
                >
                    <!-- TODO: render article page with 'loading background' while article is loading -->
                    <section class="article__abstract">
                        <h2 id="article__abstract-title">ABSTRACT</h2>
                        <p>
                            {{ article.abstract }}
                        </p>
                    </section>

                    <hr>

                    <div class="article__body">
                        <section
                            v-for="section in article.body"
                            v-html="section.processed"
                        >
                        </section>

                    </div>

                    <hr v-view="onPresenceOfBiblio">

                    <section
                        class="article__biblio"
                    >
                        <h2>BIBLIOGRAPHY</h2>

                        <p v-html="article.references.processed"></p>
                    </section>
                </div>
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
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
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
    // TODO: clean up footer and header css
    // TODO: consider creating a footer (and maybe header) component?

    @Prop() private mainTitleOffScreen: boolean;

    // Children props
    private navArrowHovered: boolean;

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

        this.navArrowHovered = false;

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
    
    $pageWidth: 50vw;
    $margin: calc(#{$pageWidth} / 8.5);
    $activeMenuWidth: 20px;
    $fontSize: 17px;

    .article {
        overflow-x: initial;
        font-family: 'Amiri', serif;
    }

    .article__header {
        position: relative;
        width: 100%;
        height: $navBarWidth;
    }

    .article__info {
        position: fixed;
        top: 0;
        left: calc(#{$navBarWidth} + 3px);
        height: $navBarWidth;
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
        max-width: 50vw;
        padding: 20px;
        z-index: -1;

        background: white;
    }

    .article__info-container--headroom {
        box-shadow: 8px 8px 10px 2px #00000029;
    }

    .article__info-container--embedded {
        margin-left: 3px;
        box-shadow: 0 0 0 0 transparent !important;
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
        position: absolute;
        // TODO: figure out how to center on entire page?
        left: calc(50% - #{$lefterWidth});
        transform: translateX(calc(-50% - #{$lefterWidth}));
        margin-top: calc(240px * 0.5);

        text-align: left;
    }

    .article__page {
        width: calc(#{$pageWidth} - 10vw);
        padding: 5vw;
        margin: 0 auto $margin auto;

        background: #fafafa;

        box-shadow: 3px 3px 8px 1px #d5d5d5;
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

    /* HEADROOM STATES */

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

    hr {
        margin: $margin;
    }

    /* STYLING FOR INSERTED HTML FROM DRUPAL */

    section {
        margin-bottom: 4em;
    }

    section /deep/ * {
        font-size: 1.7em;
    }

    section /deep/ h2 {
        padding: calc(-1 * #{$margin} / 4) 0 calc(#{$margin} / 4) 0;
        font-size: 2.5em;
        line-height: 1.5em;
    }

    section /deep/ h3 {
        padding: calc(#{$fontSize} * 4) 0 calc(#{$fontSize} * 2) 0;

        font-weight: bold;
        text-transform: uppercase;
        font-size: calc(#{$fontSize} + 5px);
        text-indent: 0;
        text-align: center;
    }

    section /deep/ h4 {
        width: calc(#{$pageWidth} / 2);
        padding: 25px auto;

        outline: 4px #000;

        font-size: 25px;
        text-indent: 0;
        line-height: 125%;
    }

    section /deep/ h1 span:before,
    section /deep/ h2 span:before,
    section /deep/ h3 span:before,
    section /deep/ h4 span:before,
    section /deep/ h5 span:before,
    section /deep/ h6 span:before {
        content: ' ';
        display: block;
    }

    section /deep/ h1 span,
    section /deep/ h2 span,
    section /deep/ h3 span,
    section /deep/ h4 span,
    section /deep/ h5 span,
    section /deep/ h6 span {
        line-height: 0.8em;
        font-size: 0.8em;
        margin-left: 1em;
    }

    section /deep/ p {
        padding-bottom: 6px;

        text-align: justify;
        line-height: 150%;
        text-indent: 50px;
    }

    section /deep/ blockquote {
        padding: calc(#{$margin} / 2.5) calc(#{$margin} / 1.5);
        font-weight: lighter;
        border-left: 3px solid rgba(0, 0, 0, 0.08);
    }

    // TODO: change 'section /deep/ *' to not have to force 1em to two deep tags
    section /deep/ a {
        font-size: 1em;
    }

    section /deep/ em {
        font-size: 1em;
    }

    section /deep/ blockquote p {
        text-indent: 0;
        font-size: 1em;
    }

    section /deep/ blockquote strong {
        font-weight: normal;
        font-size: 1.2em;
    }

    .article__biblio /deep/ p {
        font-size: 1.3em;
    }
</style>
