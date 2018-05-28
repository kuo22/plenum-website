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
import Home from '@/views/Home';
import NavBar from '@/views/NavBar';
// TODO: move Menus out of view folder, it's a component!


@Component({
    components: {
        NavBar,
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
    $lefterWidth: 240px;

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
      width: 100vw;
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
  }

  .content-section {
      width: calc(100vw - #{$lefterWidth});
      height: 100vh;
      float: right;
  }

  .fade-enter-active, .fade-leave-active {
      transition: opacity .25s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
  }
</style>