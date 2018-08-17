<template>
    <div
        class="navbar main lefter"
        @mouseover="playLogo = true"
        @mouseout="playLogo = false"
    >
        <div class="logo grid-frame">
            <the-logo :playLogo="playLogo"></the-logo>
        </div>

        <nav
            role="navigation"
            aria-label="Plenum Main Navigation"
        >
            <the-main-menu :menuItems="menuItems"></the-main-menu>
        </nav>

        <div class="about-brief grid-frame">
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
    private playLogo: boolean = false;

    constructor() { super(); }

    @Emit('update:playLogo')
    private logoHovered(isHovered: boolean) {
        // Filler
    }

}
</script>

<style lang="scss">
</style>

<style lang="scss" scoped>
    $lefterWidth: 240px;
    $border: 3px solid black;
    $menuFont: 'Avenir', 'Open Sans', sans-serif;
    $readFont: 'Crimson Text', serif;

    nav[role=navigation] {
        height: calc(100% - (#{$lefterWidth} * 2) - 30px - 3px); // subtracting padding and border width
        background: white;
        padding: 15px 15px 0 15px;
    }

    .navbar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: $lefterWidth;
        z-index: 4;
        background: white;
    }

    .main {
        z-index: 5;
        background: white;
    }

    .grid-frame {
        width: $lefterWidth;
        height: $lefterWidth;
        text-align: center;
        background: white;
    }

    .logo {
        border-bottom: $border;
    }

    .logo-helper { /* Adds an empty span block to displace the logo to the center*/
        display: inline-block;
        height: 100%;
        vertical-align: middle;
    }

    #logo img {
        vertical-align: middle;
        max-width: 80%;
        max-height: 80%;
    }

    .about-brief {
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: $border;
        padding: 15px 15px 0 15px;
        width: calc(#{$lefterWidth} - 30px);
    }

    .about-brief p {
        vertical-align: middle;
        font-family: $menuFont;
        font-size: 15.41px;
        text-align: left;
        line-height: 20px;
        font-weight: bold;
        text-indent: unset;
    }

</style>

