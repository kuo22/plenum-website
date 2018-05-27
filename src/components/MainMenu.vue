<template>
    <div id="main-menu">
        <ul id="menu">
            <a v-for="item in menuItems"
               @mouseenter="updateHoverState(true, item)"
               @mouseleave="updateHoverState(false, item)"
            >
                <li :style="changeBackground(item)" >
                    <h1 v-on:click="open(item)">{{ item.name }}</h1>
                </li>
            </a>
        </ul>
    </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import {MenuItem} from '@/classes/MenuItem';

@Component({
        components: {

        },
    })

// Main navigation menu for the app
export default class MainMenu extends Vue {
    @Prop() private menuItems!: MenuItem[]; // Main Menu Options

    constructor() {
        super();
    }

    // Updates hover state of the provided menu item
    public updateHoverState(newHoverState: boolean, item: MenuItem) {
        item.hoverState = newHoverState;
    }

    // Changes the background color of a menu item based on its hover state
    public changeBackground(item: MenuItem): {} {
        let bg = {};

        if (item.hoverState || item.open) {
            bg = { background: 'transparent' };
        } else {
            bg = { background: item.color };
        }

        return bg;
    }

    // Emits an open event to the parent
    @Emit('open') public open(item: MenuItem): void {
        /* tslint fix - 'no-empty blocks' */
    }
}
</script>

<style lang="scss" scoped>

    #main-menu {
        padding: 15px;
    }

    li {
        padding: 2px 7px;
        margin: 15px 0px;
        text-align: right;
    }

    li:hover {
        background: transparent;
    }

    a:hover {
        cursor: pointer;
    }

</style>