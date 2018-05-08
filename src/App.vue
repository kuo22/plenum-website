<template>
  <div id="app">
    <a id="logo"><router-link to="/"><img src="./assets/logo.svg"></router-link></a>
    <router-link id="info" to="/about"><img src="./assets/info.svg"></router-link>
    <transition name="fade" mode="in-out">
        <router-view class="view"></router-view>
    </transition>
    <!--ProjectTextMenu v-bind:projects="projects"/-->
    <!--VisualMenu v-bind:projects="projects"/-->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import FilterMenu from './components/FilterMenu.vue';
import ProjectTextMenu from './components/ProjectTextMenu.vue';
import VisualMenu from './components/VisualMenu.vue';

import Project from './interfaces/Project';

@Component({
    components: {
        ProjectTextMenu,
        VisualMenu,
        FilterMenu,
    },
})

export default class App extends Vue {



    constructor() {
        super();


    }


}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  #logo img {
    position: absolute;
    top: 15px;
    left: 15px;
    width: 135px;
  }

  #info img {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 20px;
  }

  .fade-enter-active, .fade-leave-active {
      transition: opacity .25s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
  }
</style>