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

        <transition
            name="component-fade"
            mode="out-in"
        >
            <router-view
                class="content-section"
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

    private menuLoading: boolean; // Menu loading state

    constructor() {
        super();
        this.menuLoading = true;
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
        if (visitCount > 0) {
            this.$router.go(visitCount * -1);
            this.$store.dispatch('routerNav/resetVisitCount');
        }
        this.$store.dispatch('menuTree/closeMenuExpansions');
    }
}
</script>

<style lang="scss">
    @import 'styles/_settings';

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
        z-index: 4;
    }

    .grid-frame {
        width: $lefterWidth;
        height: $lefterWidth * 2;

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
        padding-left: calc(#{$lefterWidth} * 1.5);
        padding-right: calc(100% - (100% - #{$lefterWidth} * 6.75));
        height: 100vh;
        // left: calc(#{$lefterWidth} * 1.5);
        top: 0;
        left: 0;

        overflow-x: hidden;
        overflow-y: scroll;
    }

    .content-section > * {
        //width: calc(100% - #{$lefterWidth} * 4.5);
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

    .component-fade-enter-active, .component-fade-leave-active {
        transition: opacity .3s ease;
    }
    .component-fade-enter, .component-fade-leave-to
        /* .component-fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>