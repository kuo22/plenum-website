<template>
    <div id="lefter">


        <div class="frame" id="logo">
            <router-link to="/">
                <span class="helper"></span>
                <img src="@/assets/plenum-logo-raster.png">
            </router-link>
        </div>
    <MainMenu></MainMenu>

        <div class="frame" id="about">
            <p>Plenum is an online journal devoted to showcasing the highest quality scholarship in undergraduate geography.
            It is managed, produced, and reviewed by undergraduate students from the Department
            of Geography at the University of Washington.</p>
        </div>


    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MainMenu from '@/components/MainMenu';


@Component({
      components: {
          MainMenu,
      },
})
export default class Home extends Vue {

    constructor() {
        super();

    }

}
</script>

<style lang="scss" scoped>
    $lefterWidth: 240px;
    $border: 3px solid black;
    $menuFont: 'Open Sans', sans-serif;
    $readFont: 'Crimson Text', serif;

    #lefter {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        border-right: $border;
        width: $lefterWidth;
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

    #about {
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: $border;
    }
</style>
