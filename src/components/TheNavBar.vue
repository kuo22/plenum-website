<template>
    <div
        class="navbar"
        @mouseover="animateLogo = true"
        @mouseout="animateLogo = false"
    >
        <div class="navbar__logo-frame grid-frame">
            <!-- TODO: close menu when logo is activated -->
            <the-logo
                :playLogo="animateLogo"
                @logoClicked="logoClicked"
            ></the-logo>
        </div>

        <nav
            class="navbar__main-menu"
            role="navigation"
            aria-label="Plenum Main Navigation"
        >
            <the-main-menu :menuItems="menuItems"></the-main-menu>
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
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import TheMainMenu from '@/components/TheMainMenu';
import {MainMenuItem} from '../classes/MainMenuItem';
import TheLogo from '@/components/TheLogo';


@Component({
    components: {
        TheMainMenu,
        TheLogo,
    },
})

// The main navigation bar for the app, each entry represents a page of wordpress content
export default class TheNavBar extends Vue {
    @Prop() private menuItems!: MainMenuItem[]; // Main Menu Options
    private animateLogo: boolean; // Whether or not the logo is animating

    constructor() {
        super();
        this.animateLogo = false;
    }

    @Emit('logoClicked')
    private logoClicked(): void {
        // Filler
    }
}
</script>

<style lang="scss" scoped>
    $lefterWidth: 240px;
    $border: 3px solid black;
    $menuFont: 'Avenir', 'Open Sans', sans-serif;

    .navbar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: $lefterWidth;
        z-index: 5;

        background: white;
    }

    .navbar__logo-frame {
        border-bottom: $border;
    }

    .navbar__main-menu {
        height: calc(100% - (#{$lefterWidth} * 2) - 30px - 3px); // subtracting padding and border width
        padding: 15px 15px 0 15px;

        background: white;
    }

    .navbar__about {
        position: absolute;
        bottom: 0;
        left: 0;
        width: calc(#{$lefterWidth} - 30px);
        padding: 15px 15px 0 15px;

        border-top: $border;

        font-family: $menuFont;
        font-weight: bold;
    }

    .navbar__about p {
        vertical-align: middle;
        margin: 1em 0;
        font-size: 15.41px; // TODO: make responsive?
        text-align: left;
        line-height: 20px;
        text-indent: unset;
    }

</style>

