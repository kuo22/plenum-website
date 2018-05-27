<template>
    <div id="app">
        <Menu id="menu-grid-section"></Menu>
        <Home id="content-grid-section"></Home>
        <transition name="fade" mode="in-out">
        <router-view class="view"></router-view>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Home from '@/views/Home';
import Menu from '@/views/Menu';
// TODO: move Menus out of view folder, it's a component!


@Component({
    components: {
        Menu,
        Home,
    },
})

export default class App extends Vue {

    constructor() {
        super();
    }
}
</script>

<style lang="scss">
    $menuFont: 'Avenir', 'Open Sans', sans-serif;
    $readFont: 'Crimson Text', serif;

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
    margin-top: 60px;
      width: 100%;
      height: 100%;
  }

  h1 {
      font-size: 1.75em;
  }

  h2 {
      font-size: 1.4em;
  }

  #menu-section {
      z-index: 3;
  }

  #content-section {

  }

  .fade-enter-active, .fade-leave-active {
      transition: opacity .25s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
  }
</style>