<template>
    <div v-on:mouseover="playLogo = true"
         v-on:mouseout="playLogo = false">
        <div id="main" class="lefter">

            <div id= "logo" class="grid-frame">
                <logo-animated :playLogo="playLogo"></logo-animated>
                <!--router-link to="/">
                    <span class="logo-helper"></span>
                    <img src="@/assets/plenum-logo-raster.png">
                </router-link-->
            </div>

            <main-menu v-bind:menuItems="menuItems"
                       v-on:open="toggleOpenMenu"></main-menu>

            <div class="grid-frame" id="about-brief">
                <p>
                    Plenum is an online journal devoted to showcasing the highest quality scholarship in undergraduate
                    geography. It is managed, produced, and reviewed by undergraduate students from the Department
                    of Geography at the University of Washington.
                </p>
            </div>

        </div>

        <transition name="submenu-slide" v-for="item in menuItems">
            <sub-menu class="submenu"
                      :class="{ active: item.active, open: item.open, hidden: item.hidden }"
                      v-show="item.open || item.active"
                      v-bind:menu="item"
                      v-on:activateMenu="toggleActiveMenu"
                      v-on:toggleOpen="toggleOpenMenu"></sub-menu>
        </transition>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import MainMenu from '@/components/MainMenu';
import SubMenu from '@/components/SubMenu';
import {MainMenuItem} from '../classes/MainMenuItem';
import LogoAnimated from '@/components/LogoAnimated';
import * as hsluv from '../../node_modules/hsluv/hsluv.js';
import {error} from 'util';
import {Action, Getter, State} from 'vuex-class';
import {DrupalMenu} from '../types/types';
import {MenuTreeState} from '../types/storeTypes';
import {SubmenuLink} from '../classes/SubmenuLink';


@Component({
    components: {
        MainMenu,
        SubMenu,
        LogoAnimated,
    },
})

// The main navigation bar for the app, each entry represents a page of wordpress content
export default class NavBar extends Vue {
    @Prop() private itemName: string;
    private playLogo: boolean = false;
    @Prop() private menuItems: MainMenuItem[]; // Main Menu Options

    constructor() {
        super();
    }

    // Sets the open menu and if the menu to open is already open, it closes
    // parameter(s) needed:
    //      item = main menu item to be opened or closed
    public toggleOpenMenu(item: MainMenuItem): void {
        const alreadyOpen: boolean = item.open;

        if (item.open) {
            item.open = false;
            if (item.active) {
                this.toggleActiveMenu(item, false);
            }
        } else {
            for (const menuItem of this.menuItems) {
                menuItem.open = false;
            }

            if (item.subMenu) {
                item.open = true;
                item.hidden = false;
            } else {
                this.toggleActiveMenu(item);
            }

        }
    }

    // Toggles the active state of main menu item or optionally declares the active state
    // parameter(s) needed:
    //      item    = main menu item
    //      active  = whether or not the main menu item is being actively used
    private toggleActiveMenu(item: MainMenuItem, active?: boolean = !item.active): void {
        // Reset all submenus
        for (const menuItem of this.menuItems) {
            menuItem.active = false;
            menuItem.hidden = true;
            if (Object.keys(menuItem.subMenu).length > 0) {
                this.resetSubmenuLinks(menuItem.subMenu);
            }
        }

        item.active = active;
        item.hidden = false;
    }

    // Resets all submenu links provided to be deactivated
    // parameter(s) needed:
    //      submenu = list of submenu links to be deactivated
    private resetSubmenuLinks(submenu) {
        for (const sectionLink in submenu) {
            if (submenu.hasOwnProperty(sectionLink)) {
            for (const link: SubmenuLink of submenu[sectionLink]) {
                link.active = false;
            }
            }
        }
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

    .submenu {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        outline: $border;
        left: $lefterWidth;
        width: calc(100% - calc(#{$lefterWidth} * 2));
    }
</style>

<style lang="scss" scoped>
    $lefterWidth: 240px;
    $border: 3px solid black;
    $menuFont: 'Avenir', 'Open Sans', sans-serif;
    $readFont: 'Crimson Text', serif;

    #main {
        z-index: 5;
        background: white;
    }

    .grid-frame {
        width: $lefterWidth;
        height: $lefterWidth;
        text-align: center;
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

    #about-brief {
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: $border;
    }

    .submenu {
        z-index: 3;
    }

    .submenu-slide-enter {
        z-index: 4;
    }

    .submenu-slide-enter-active {
        transition: all .5s ease;
        z-index: 4;
    }

    .submenu-slide-enter-to {
        z-index: 4;
    }

    .submenu-slide-leave {
        z-index: 4;
    }

    .submenu-slide-leave-active {
        transition: all .5s ease;
        z-index: 4;
    }

    .submenu-slide-leave-to {
        z-index: 4;
        transform: translateX(-$lefterWidth);
    }

    .submenu-slide-enter //, .submenu-slide-leave-to
        /* .slide-fade-leave-active below version 2.1.8 */ {
        transform: translateX(-$lefterWidth);
        //opacity: 0;
    }

    .open {
        z-index: 4;
    }

    .hidden {
        display: none;
    }

</style>

