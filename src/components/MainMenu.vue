<template>
    <div id="main-menu">
        <ul id="menu">
            <li v-for="item in menuItems" v-bind:style="{background: backgroundColors[item]}">
                    {{ item }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: {

    },
})
export default class MainMenu extends Vue {
    private menuItems: string[];
    private backgroundColors: {};

    constructor() {
        super();
        this.menuItems = ['About', 'Publications', 'Contribute', 'Volunteer'];
        this.backgroundColors = {About: 'rgb(255, 255, 200)',
                                Publications: 'rgb(255, 200, 255)',
                                Contribute: 'rgb(200, 255, 255)',
                                Volunteer: 'rgb(220, 220, 220)'};
    }
}
</script>

<style lang="scss" scoped>
    $menuFont: 'Open Sans', sans-serif;

    #main-menu {
        padding: 15px;
    }

    li {
        padding: 2px 7px;
        margin: 15px 0px;
        font-family: $menuFont;
        font-size: 20px;
        text-align: right;
    }


</style>