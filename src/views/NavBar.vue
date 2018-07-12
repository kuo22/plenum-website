<template>
    <div>
        <div id="main" class="lefter">

            <div id="logo" class="grid-frame">
                <router-link to="/">
                    <span class="logo-helper"></span>
                    <img src="@/assets/plenum-logo-raster.png">
                </router-link>
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
            <sub-menu class="submenu" :class="{ active: item.active }"
                      v-show="item.open || item.active"
                      v-bind:menu="item"
                      v-on:activateMenu="toggleActiveMenu"></sub-menu>
        </transition>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import MainMenu from '@/components/MainMenu';
import SubMenu from '@/components/SubMenu';
import {MainMenuItem} from '../classes/MainMenuItem';
import * as hsluv from '../../node_modules/hsluv/hsluv.js';
import {error} from 'util';
import {Action, Getter, State} from 'vuex-class';
import {DrupalMenu} from '../types/types';
import {MenuTreeState} from '../types/storeTypes';


@Component({
    components: {
        MainMenu,
        SubMenu,
    },
})

// The main navigation bar for the app, each entry represents a page of wordpress content
export default class NavBar extends Vue {
    @Prop() private itemName: string;
    @Prop() private menuItems: MainMenuItem[]; // Main Menu Options

    constructor() {
        super();
    }

    // Sets the open menu and if the menu to open is already open, it closes
    public toggleOpenMenu(item: MainMenuItem): void {
        const alreadyOpen: boolean = item.open;

        if (item.open) {
            item.open = false;
        } else {
            for (const menuItem of this.menuItems) {
                menuItem.open = false;
            }

            if (item.subMenu) {
                item.open = true;
            } else {
                this.toggleActiveMenu(item);
            }

        }
    }

    private toggleActiveMenu(item: MainMenuItem): void {
        // Reset all submenus
        for (const menuItem of this.menuItems) {
            menuItem.active = false;
        }

        item.active = !item.active;

        if (item.active) {
            item.open = false;
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
    }

    .submenu {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        outline: $border;
        left: $lefterWidth;
        width: calc(100% - #{$lefterWidth});
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
        z-index: 2;
    }



    .submenu-slide-leave-active {
        transition: all .8s ease;
        z-index: 2;
    }

    .submenu-slide-leave-to {
        z-index: 2;
        transform: translateX(-$lefterWidth);
    }

    .submenu-slide-enter //, .submenu-slide-leave-to
        /* .slide-fade-leave-active below version 2.1.8 */ {
        transform: translateX(-$lefterWidth);
        //opacity: 0;
    }

</style>

