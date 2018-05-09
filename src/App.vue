<template>
  <div id="app">
    <a id="logo"><router-link to="/"><img src="./assets/logo.svg"></router-link></a>
    <a v-on:click="aboutMeVisible = !aboutMeVisible" id="info" ><img src="./assets/info.svg"></a>
    <transition name="fade" mode="in-out">
        <router-view class="view"></router-view>
    </transition>
    <AboutMe id="about-me" v-if="aboutMeVisible"></AboutMe>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AboutMe from './components/AboutMe';


@Component({
    components: {
        AboutMe,
    },
})

export default class App extends Vue {
    private aboutMeVisible: boolean = false;

    constructor() {
        super();

        this.aboutMeVisible = false;
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

  #about-me {
    position: absolute;
    left: 300px;
    top: 300px;
    z-index: 3;
    font-size: 30px;
  }

  #info:hover {
    cursor: pointer;
  }

  .fade-enter-active, .fade-leave-active {
      transition: opacity .25s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
  }
</style>