<template>
    <nav id="main-menu-container"
         role="navigation"
         aria-label="Plenum Main Navigation">
        <ul id="menu"
            role="menubar"
            aria-label="Plenum Main Navigation">
            <li v-for="(item, index) in menuItems"
                @mouseenter="updateHoverState(true, item)"
                @mouseleave="updateHoverState(false, item)"
                :style="changeBackground(item)"
                class="menu-button">
                    <a v-if="Object.getOwnPropertyNames(item.subMenu).length > 1"
                       v-on:click="open(item)"
                       @keyup.enter="open(item)"
                       :tabindex="index === 0 ? '0' : '-1'"
                       role="menuitem"
                       aria-haspopup="true"
                       :aria-expanded="item.open ? 'true' : 'false'"
                       @keydown.down.prevent="moveDown"
                       @keydown.up.prevent="moveUp"
                       v-focus="index === focused"
                       @focus="focused = index"
                       @blur="focused = null"> <!-- inspections error, this works properly -->

                        <span class="menu-button-content"
                              tabindex="-1">
                            {{ item.name }}&nbsp;
                        </span>
                    </a>
                    <router-link v-else :to="'/' + item.name.toLowerCase()"
                                 role="link"
                                 aria-haspopup="false"
                                 :tabindex="index === 0 ? '0' : '-1'"
                                 @keydown.down.prevent.native="moveDown"
                                 @keydown.up.prevent.native="moveUp"
                                 v-focus="index === focused"
                                 @focus.native="focused = index"
                                 @blur.native="focused = null">
                        <span class="menu-button-content" tabindex="-1"> <!-- TODO: get ride of this hacky &nbsp; -->
                            {{ item.name }}&nbsp;
                        </span>
                    </router-link>
            </li>
        </ul>
    </nav>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import {MainMenuItem} from '@/classes/MainMenuItem';
import { mixin as focusMixin } from 'vue-focus';

@Component({
    mixins: [focusMixin],
    components: {

    },
})

// Main navigation menu for the app
export default class MainMenu extends Vue {
    @Prop() private menuItems!: MainMenuItem[]; // Main Menu Options
    @Prop() private focused: number;

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

    private moveDown() {
        this.focused = this.focused === this.menuItems.length - 1 ? 0 : this.focused + 1;
    }

    private moveUp() {
        this.focused = this.focused === 0 ? this.menuItems.length - 1 : this.focused - 1;
    }
}
</script>

<style lang="scss" scoped>
    $menuItemHeight: 45px;

    h1, h2, h3, h4, h5, h6 {
        font-weight: bold;
    }

    #main-menu-container {
        padding: 15px;
    }

    /*#menu li:focus-within {*/
        /*outline: 3px dashed black;*/
    /*}*/

    #menu li a:focus {
        outline: none;
    }

    #menu li a {
        font-weight: bold;
        font-size: 1.75em;
        width: 100%;
        height: 100%;
        text-decoration: none;
    }

    #menu li a span {
        line-height: $menuItemHeight;
    }

    li {
        margin: 15px 0;
        text-align: right;
        height: $menuItemHeight;
    }

    li:hover {
        background: transparent;
        cursor: pointer;
    }

</style>