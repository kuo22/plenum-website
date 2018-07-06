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
import {MainMenuItem} from '@/classes/MainMenuItem';

@Component({
        components: {

        },
    })

// Main navigation menu for the app
export default class MainMenu extends Vue {
    @Prop() private menuItems!: MainMenuItem[]; // Main Menu Options

    constructor() {
        super();
    }

    // Updates hover state of the provided menu item
    public updateHoverState(newHoverState: boolean, item: MainMenuItem) {
        item.hoverState = newHoverState;
    }

    // Changes the background color of a menu item based on its hover state
    public changeBackground(item: MainMenuItem): {} {
        let bg = {};

        if (item.hoverState || item.open || item.active) {
            bg = { background: 'transparent' };
        } else {
            bg = { background: item.color };
        }

        // If another menu item is open, while this item is active -> show background
        if (item.active) {
            for (const otherItem: MainMenuItem of this.menuItems) {
                if (otherItem.name !== item.name && otherItem.open) {
                    bg = {background: item.color};
                }
            }
        }

        return bg;
    }

    // Emits an open event to the parent
    @Emit('open') public open(item: MainMenuItem): void {
        /* tslint fix - 'no-empty blocks' */
    }
}
</script>

<style lang="scss" scoped>

    h1, h2, h3, h4, h5, h6 {
        font-weight: bold;
    }

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