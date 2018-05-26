<template>
  <div id="app">
    <Home></Home>
    <transition name="fade" mode="in-out">
        <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Home from '@/views/Home';


@Component({
    components: {

    },
})

export default class App extends Vue {

    constructor() {
        super();
    }
}
</script>

<style lang="scss">
    $menuFont: 'Open Sans', sans-serif;
    $readFont: 'Crimson Text', serif;

    * {
        margin: 0;
        padding: 0;
        color: black;
        list-style-type: none;
    }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
      width: 100%;
      height: 100%;
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