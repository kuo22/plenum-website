<template>
    <div>
        <div id="main" class="lefter">

            <div id="logo" class="grid-frame">
                <router-link to="/">
                    <span class="logo-helper"></span>
                    <img src="@/assets/plenum-logo-raster.png">
                </router-link>
            </div>

            <MainMenu v-bind:menuItems="menuItems"></MainMenu>

            <div class="grid-frame" id="about-brief">
                <p>
                    Plenum is an online journal devoted to showcasing the highest quality scholarship in undergraduate
                    geography. It is managed, produced, and reviewed by undergraduate students from the Department
                    of Geography at the University of Washington.
                </p>
            </div>

        </div>

        <SubMenu v-for="item in menuItems" v-bind:menu="item"></SubMenu>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MainMenu from '@/components/MainMenu';
import SubMenu from '@/components/SubMenu';
import {MenuItem} from '../classes/MenuItem';


@Component({
    components: {
        MainMenu,
        SubMenu,
    },
})
export default class Menu extends Vue {
    private menuItems: MenuItem[]; // Main Menu Options

    constructor() {
        super();

        this.menuItems = [
            new MenuItem(
                'About',
                'rgb(255, 255, 200)',
                {
                    About: ['About Plenum', 'About the Authors', 'About the Editors'],
                        // TODO: IF ONLY ONE HEADER, do NOT show header, just subheaders
                },
            ),
            new MenuItem(
                'Publications',
                'rgb(255, 200, 255)',
                {
                    'Peer-Reviewed': ['Edition 2017', 'Edition 2018'],
                    'Showcase': ['GIS', 'Art', 'Book Reviews'],
                },
            ),
            new MenuItem(
                'Contribute',
                'rgb(200, 255, 255)',
            ),
            new MenuItem('Volunteer', 'rgb(220, 220, 220)'),
        ];
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
</style>

<style lang="scss" scoped>
    $lefterWidth: 240px;
    $border: 3px solid black;
    $menuFont: 'Avenir', 'Open Sans', sans-serif;
    $readFont: 'Crimson Text', serif;

    #main {
        z-index: 2;
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
    }

    #about-brief {
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: $border;
    }
</style>

