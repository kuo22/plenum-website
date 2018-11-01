<template>
    <div
        id="app"
        @keydown.tab="revertMenuSession"
    >
        <transition appear>
            <the-nav-bar
                class="lefter"
                @logoClicked="handleLogoClick"
                @revertMenuSession="revertMenuSession"
                @openContent="handleOpenContentEvent"
            ></the-nav-bar>
        </transition>

        <span
            class="content-section content-section__overlay"
        >
            <!--            :class="this.$store.getters['menuTree/anyMenuIsOpen'] ? 'content-section__overlay--dimmed' : null"-->

        </span>

        <vue-headroom

            :speed="350"
            :z-index="9"
        >
            <header class="site-header">
                <div
                    class="site-header__title-container"
                    :class="{'site-header__title-container--hidden': !isAtPageTop}"
                >
                    <img class="site-header__title" src="@/assets/plenum-title.svg">
                    <img class="site-header__subtitle" src="@/assets/plenum-subtitle.svg">
                </div>
            </header>
        </vue-headroom>

        <transition
            name="component-fade"
            mode="out-in"
        >
            <router-view
                class="content-section"
                @scroll.native="handleViewScrollEvent"
                @click.native="revertMenuSession"
                @focus.native="revertMenuSession"
            >
            </router-view>
        </transition>

        <the-site-footer class="site-footer"></the-site-footer>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {Action} from 'vuex-class';
import TheNavBar from '@/components/TheNavBar';
import Home from '@/views/Home';
import TheSiteFooter from './components/TheSiteFooter';

@Component({
    components: {
        TheSiteFooter,
        TheNavBar,
        Home
    },
    computed: {

    }
})

export default class App extends Vue {
    @Action('menuTree/createMenu') private createMenu;

    private isAtPageTop!: boolean;

    private menuLoading: boolean; // Menu loading state

    constructor() {
        super();
        this.menuLoading = true;
        this.isAtPageTop = true;
        // this.menuOpen = false; // TODO: Initialize to open for when collection URL is requested
    }

    // When the app is created, create the app's main navigation menu
    public async created() {
        await this.createMenu()
            .then(() => {
                this.menuLoading = false;
            })
            .catch((err) => {
                // TODO: Handle loading error
                console.error(err);
            });
    }

    private get currentViewEl() {
        return () => this.$refs.home.$el;
    }

    private handleViewScrollEvent(e) {
        console.log(this.$refs);
        console.log(window);
    }

    // Process to handle logo click event
    private handleLogoClick(): void {
        this.$router.push('/');
        let visitCount = this.$store.getters['routerNav/getVisitCount'];
        if (visitCount > 0) {
            this.$store.dispatch('routerNav/resetVisitCount');
            this.$store.dispatch('menuTree/closeMenuExpansions');
        }
    }

    // Handles the event from the user requesting an article
    private handleOpenContentEvent(routerLinkLocation: string, keyBoardEvent: boolean) {
        this.$store.dispatch('routerNav/resetVisitCount');
        if (keyBoardEvent) {
            this.$router.push(routerLinkLocation);
        }
        this.$store.dispatch('menuTree/closeMenuExpansions');
    }

    // Returns the app to the state that was before the menu session
    private revertMenuSession(): void {
        let visitCount = this.$store.getters['routerNav/getVisitCount'];
        // If menu session didn't include clicked publication links
        if (visitCount > 0) {
            this.$router.go(visitCount * -1);
            this.$store.dispatch('routerNav/resetVisitCount');
        } else if (this.$route.path.includes('publications')) { // if menu session began open b/c first visit to site was to collection
            this.$router.push('/');
            this.$store.dispatch('routerNav/resetVisitCount');
        }
        this.$store.dispatch('menuTree/closeMenuExpansions');
    }
}
</script>

<style lang="scss">
    @import 'styles/_settings';
    @import 'styles/focusable';

    * {
        margin: 0;
        padding: 0;
        color: black;
        list-style-type: none;
        font-weight: normal;
        margin-block-start: 0;
        margin-block-end: 0;
        font-size: 12px;
    }

    a {
        text-decoration: none;
    }

    #app {
        position: fixed;
        width: 99vw; // 100vw adds a scroll bar to the bottom of page
        height: 100vh;

        color: #2c3e50;

        text-align: center;
        font-family: $sansSerifFont;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
    }

    .lefter {
        position: absolute;
        top: 0;
        left: 0;
        width: $lefterWidth;
        z-index: 10;
    }

    .grid-frame {
        width: $lefterWidth;
        height: calc(#{$lefterWidth} * 2 + 80px); // Arbitrary 80px to avoid overlap with title on home...

        background: white;

        text-align: center;
    }

    .before-appear {
        opacity: 0;
    }

    .appear {
        transition: opacity 0.3s ease-in;
    }

    .after-appear {
        opacity: 1;
    }

    .content-section {
        position: absolute;
        width: calc(100% - #{$lefterWidth} * 4.5);
        padding-top: $headerHeight;
        padding-left: calc(#{$lefterWidth} * 1.5);
        padding-right: calc(100% - (100% - #{$lefterWidth} * 6.75));
        height: calc(100vh - #{$headerHeight});
        // left: calc(#{$lefterWidth} * 1.5);
        top: 0;
        left: 0;

        overflow-x: hidden;
        overflow-y: scroll;
    }

    .content-section::-webkit-scrollbar {
        width: 0;
        position: fixed;
        right: 0;
    }

    .content-section::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    }

    .content-section::-webkit-scrollbar-thumb {
        background-color: darkgrey;
        outline: 1px solid slategrey;
    }

    .content-section__overlay {
        position: fixed;
        left: 0;
        z-index: 4;
        background: rgba(0, 0, 0, 0.02);
        pointer-events: none;
        opacity: 0;

        transition: opacity 0.3s ease;
    }

    .content-section__overlay--dimmed {
        opacity: 1;

        transition: opacity 0.3s ease;
    }

    .site-footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: $footerHeight;
        background: transparent;
    }

    .headroom {
        width: 100vw;
        height: $headerHeight;
    }

    .headroom--not-top.headroom--pinned {
        border-bottom: 3px solid black;
    }

    .site-header {
        width: calc(100vw - #{$headerHeight});
        height: $headerHeight;
        position: absolute;
        top: 0;
        left: $lefterWidth;

        background: white;
    }

    .site-header__title-container {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        vertical-align: middle;
    }

    .site-header__title {
        display: inline-block;
        left: 0;
        width: 6em;

        margin-right: 1em;
        vertical-align: middle;
    }

    .site-header__subtitle {
        display: inline-block;
        width: 20em;
        left: 0;
        vertical-align: middle;
    }

    .component-fade-enter-active, .component-fade-leave-active {
        transition: opacity .3s ease;
    }
    .component-fade-enter, .component-fade-leave-to
        /* .component-fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>