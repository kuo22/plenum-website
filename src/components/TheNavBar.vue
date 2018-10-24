<template>
    <div
        class="navbar"
        @mouseover="isLogoAnimated = true"
        @mouseout="isLogoAnimated = false"
    >
        <div class="navbar__logo-frame grid-frame">
            <the-logo
                :playLogo="isLogoAnimated"
                :dimension="navBarWidth"
                @logoClicked="logoClicked"
            ></the-logo>
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

        <div class="navbar__about grid-frame">
            <p>
                Plenum is an online journal devoted to showcasing the highest quality scholarship in undergraduate
                geography. It is managed, produced, and reviewed by undergraduate students from the Department
                of Geography at the University of Washington.
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Emit, Vue} from 'vue-property-decorator';
import TheMainMenu from '@/components/TheMainMenu';
import TheLogo from '@/components/TheLogo';
import { mapGetters } from 'vuex';

@Component({
    components: {
        TheMainMenu,
        TheLogo
    },
    computed: {
        ...mapGetters({
            "menuTree": 'menuTree/menuTree'
        })
    }
})

// The main navigation bar for the app
export default class TheNavBar extends Vue {
    private isLogoAnimated: boolean; // Animation state of the logo
    private navBarWidth: number = 240; // Width of the navigation bar

    constructor() {
        super();
        this.isLogoAnimated = false;
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
    $navBarWidth: 240px;
    $border: 3px solid black;
    $menuFont: 'Avenir', 'Open Sans', sans-serif;

    .navbar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: $navBarWidth;
        z-index: 5;

        background: white;
    }

    .navbar__logo-frame {
        border-bottom: $border;
    }

    .navbar__main-menu {
        // (Full height) - (Two squares with navBarWidth dimension) - (Top and Bottom padding) - (Top-border width)
        height: calc(100% - (#{$navBarWidth} * 2) - (15px * 2) - 3px);
        padding: 15px 15px 0 15px;

        background: white;
    }

    .navbar__about {
        position: absolute;
        bottom: 0;
        left: 0;
        width: calc(#{$navBarWidth} - 30px);
        padding: 15px 15px 0 15px;

        border-top: $border;

        font-family: $menuFont;
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

