<template>
    <div id="app">
        <nav-bar id="menu-grid-section"></nav-bar>
        <transition name="fade" mode="in-out">
            <router-view class="view content-section"></router-view>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {State, Action, Getter} from 'vuex-class';
import Home from '@/views/Home';
import NavBar from '@/views/NavBar';
import { MenuTreeState, Menu } from './types';

const namespace: string = 'menuTree';

// TODO: move Menus out of view folder, it's a component!


@Component({
    components: {
        NavBar,
        Home,
    },
})

export default class App extends Vue {
    @State('menuTree') public menuTree: MenuTreeState;
    @Action('fetchData', { namespace }) public fetchData: any;
    // @Getter('menuTree', { namespace }) public menuTree: Menu[];


    constructor() {
        super();
    }

    public created() {
        this.fetchData();
    }
}
</script>

<style lang="scss">
    $menuFont: 'Avenir', 'Open Sans', sans-serif;
    $readFont: 'Crimson Text', serif;
    $lefterWidth: 240px;
    $activeSubmenuWidth: 20px;
    $borderWidth: 3px;

    * {
        margin: 0;
        padding: 0;
        color: black;
        list-style-type: none;
    }


  #app {
    font-family: $menuFont;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
      width: 100%;
      height: 100vh;
  }

  h1 {
      font-size: 1.75em;
  }

  h2 {
      font-size: 1.4em;
  }
  
  #menu-grid-section {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: $lefterWidth;
      z-index: 4;
  }

  .content-section {
      width: calc(100% - #{$lefterWidth});
      height: 100vh;
      position: absolute;
      right: 0;
      bottom: 0;
  }

  .fade-enter-active, .fade-leave-active {
      transition: opacity .1s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
  }
</style>