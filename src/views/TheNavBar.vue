<template>
    <div
        v-on:mouseover="playLogo = true"
        v-on:mouseout="playLogo = false"
    >
        <div
            id="main"
            class="lefter"
        >

            <div
                id= "logo"
                class="grid-frame"
            >
                <the-logo :playLogo="playLogo"></the-logo>
                <!--router-link to="/">
                    <span class="logo-helper"></span>
                    <img src="@/assets/plenum-logo-raster.png">
                </router-link-->
            </div>

            <nav role="navigation"
                 aria-label="Plenum Main Navigation">
                <the-main-menu v-bind:menuItems="menuItems"></the-main-menu>
            </nav>

            <div
                class="grid-frame"
                id="about-brief"
            >
                <p>
                    Plenum is an online journal devoted to showcasing the highest quality scholarship in undergraduate
                    geography. It is managed, produced, and reviewed by undergraduate students from the Department
                    of Geography at the University of Washington.
                </p>
            </div>

        </div>

        <!--&lt;!&ndash; TODO: move the submenu into the mainmenu component &ndash;&gt;-->
        <!--<transition name="submenu-slide" v-for="item in menuItems">-->
            <!--<sub-menu class="submenu"-->
                      <!--:class="{ active: item.active, open: item.open, hidden: item.hidden }"-->
                      <!--v-show="item.open || item.active"-->
                      <!--v-bind:menu="item"-->
                      <!--v-on:activateMenu="toggleActiveMenu"-->
                      <!--v-on:toggleOpen="toggleOpenMenu"></sub-menu>-->
        <!--</transition>-->
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
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
    @Prop() private itemName: string;
    private playLogo: boolean = false;
    @Prop() private menuItems: MainMenuItem[]; // Main Menu Options

    constructor() {
        super();
    }
}
</script>

<style lang="scss">
    $lefterWidth: 240px;
    $border: 3px solid black;

    .lefter {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        outline: $border;
        width: $lefterWidth;
        z-index: 4;
    }
</style>

<style lang="scss" scoped>
    $lefterWidth: 240px;
    $border: 3px solid black;
    $menuFont: 'Avenir', 'Open Sans', sans-serif;
    $readFont: 'Crimson Text', serif;

    nav[role=navigation] {
        height: calc(100% - (#{$lefterWidth} * 2) - 15px - 3px); // subtracting padding and border width
        background: white;
        padding: 15px 15px 0 15px;
    }

    #main {
        z-index: 5;
        background: white;
    }

    .grid-frame {
        width: $lefterWidth;
        height: $lefterWidth;
        text-align: center;
        background: white;
    }

    #logo {
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

    #about-brief {
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: $border;
    }

    #about-brief p {
        padding: 15px;
        vertical-align: middle;
        font-family: $menuFont;
        font-size: 15.41px;
        text-align: left;
        line-height: 20px;
        font-weight: bold;
        text-indent: unset;
    }

</style>

