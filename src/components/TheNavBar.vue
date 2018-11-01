<template>
    <div
        class="navbar"
    >
        <div class="grid-frame">
            <div class="navbar__logo-frame">
                <svg
                    class="navbar__logo" version="1.1" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 53.033 53.032" enable-background="new 0 0 53.033 53.032" xml:space="preserve">
                    <router-link
                        to="/"
                        title="Return to Home"
                        tabindex="0"

                        class="focusable"

                        @click.native="logoClicked"
                    >
                        <!-- rect class="navbar__logo__logo-shape focusable__content"  transform="matrix(0.7071 0.7071 -0.7071 0.7071 26.5161 -10.984)" fill="transparent" stroke="#000000" stroke-width="7" stroke-miterlimit="10" width="30" height="31"/-->
                        <rect class="navbar__logo__logo-shape focusable__content" tabindex="-1" x="11.517" y="11.016"></rect>
                    </router-link>
                </svg>
            </div>
            <!--the-logo
                :playLogo="isLogoAnimated"
                :dimension="navBarWidth"
                @logoClicked="logoClicked"
            ></the-logo-->
        </div>

        <nav
            class="navbar__main-menu"
            role="navigation"
            aria-label="Plenum Main Navigation"
        >
            <the-main-menu
                :menuItems="menuTree"
                @revertMenuSession="revertMenuSession"
                @openContent="openContent"
            ></the-main-menu>
        </nav>
    </div>
</template>

<script lang="ts">
import {Component, Emit, Vue} from 'vue-property-decorator';
import TheMainMenu from '@/components/TheMainMenu';
import { mapGetters } from 'vuex';

@Component({
    components: {
        TheMainMenu
    },
    computed: {
        ...mapGetters({
            "menuTree": 'menuTree/menuTree'
        })
    }
})

// The main navigation bar for the app
export default class TheNavBar extends Vue {
    private navBarWidth: number = 240; // Width of the navigation bar

    constructor() {
        super();
    }

    @Emit('openContent')
    private openContent(routerLinkLocation: string, keyboardEvent?: boolean = true) {}

    @Emit('revertMenuSession')
    private revertMenuSession(): void {}

    // Emits logo click event to parent
    @Emit('logoClicked')
    private logoClicked(): void {}
}
</script>

<style lang="scss" scoped>
    @import '../styles/_settings';

    .navbar {
        //position: relative;
    }

    .navbar__logo-frame {
        width: $headerHeight;
        height: $headerHeight;
    }

    .navbar__logo__logo-shape {
        transform: matrix(0.7071, 0.7071, -0.7071, 0.7071, 26.5161, -10.984);
        fill: transparent;
        stroke: #000000;
        stroke-width: 7px;
        stroke-miterlimit: 10;
        width: 30px !important;
        height: 31px !important;

        transition: transform 0.5s ease;
    }

    .navbar__logo {
        width: 75px;
        height: 100px;
        transform: translateY(-50%);
        top: 50%;
        position: relative;
    }

    .navbar__logo a {
        outline: none;
    }

    .focusable:focus > .focusable__content {
        transform: translateY(0px);
        outline: 0 solid transparent;

        transition: transform 0.5s ease;
    }

    .navbar__main-menu {
        // (Full height) - (Two squares with navBarWidth dimension) - (Top and Bottom padding) - (Top-border width)
        // height: calc(100% - (#{$navBarWidth} * 2) - (15px * 2));
        padding: 15px 0;

        background: white;
    }

    .navbar__about {
        position: absolute;
        bottom: 0;
        left: 0;
        width: calc(#{$navBarWidth} - 30px);
        padding: 15px 15px 0 15px;

        font-family: $sansSerifFont;
        font-weight: bold;
    }

    .navbar__about p {
        vertical-align: middle;
        margin: 1em 0;
        font-size: 15.41px; // TODO: make responsive
        text-align: left;
        line-height: 20px;
        text-indent: unset;
    }

</style>

