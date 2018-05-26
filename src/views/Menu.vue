<template>
  <div id="menu">
    <div id="main" class="lefter">

      <div class="frame" id="logo">
        <router-link to="/">
          <span class="helper"></span>
          <img src="@/assets/plenum-logo-raster.png">
        </router-link>
      </div>
      <MainMenu v-bind:menuItems="menuItems"></MainMenu>

      <div class="frame" id="about-brief">
        <p>Plenum is an online journal devoted to showcasing the highest quality scholarship in undergraduate geography.
          It is managed, produced, and reviewed by undergraduate students from the Department
          of Geography at the University of Washington.</p>
      </div>

    </div>
    <div v-for="item in menuItems" :id="item.name.toLowerCase()" class="lefter submenu" :style="{background: item.color}">
        <ul v-for="header in item.subMenu">
            <li v-for="subheader in header">
                <a>
                    <h2>{{ subheader }}</h2>
                </a>
            </li>
        </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MainMenu from '@/components/MainMenu';
import {MenuItem} from '../classes/MenuItem';


@Component({
    components: {
        MainMenu,
    },
})
export default class Menu extends Vue {
    private menuItems: MenuItem[];

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
            new MenuItem('Contribute', 'rgb(200, 255, 255)'),
            new MenuItem('Volunteer', 'rgb(220, 220, 220)'),
        ];
    }

}
</script>

<style lang="scss" scoped>
  $lefterWidth: 240px;
  $border: 3px solid black;
  $menuFont: 'Open Sans', sans-serif;
  $readFont: 'Crimson Text', serif;

  .lefter {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    border-right: $border;
    width: $lefterWidth;
  }

  #main {
      z-index: 2;
      background: white;
  }

  .submenu {
      z-index: 1;
  }

  .submenu a:hover {
      cursor: pointer;
  }

  .frame {
    width: $lefterWidth;
    height: $lefterWidth;
    text-align: center;
  }

  #logo {
    border-bottom: $border;
  }

  .helper { /* Adds an empty span block to displace the logo to the center*/
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }

  #logo img {
    vertical-align: middle;
    max-width: 80%;
    max-height: 80%;
  }

  p {
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

    #about {
        left: 250px;
    }
</style>

