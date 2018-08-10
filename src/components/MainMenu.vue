<template>
    <ul id="main-menu"
        role="menubar"
        aria-label="Plenum Main Navigation">
        <li v-for="(menu, index) in menuItems"
            :id="menu.name.toLowerCase().replace(' ', '-') + '-main-menu-item'"
            @mouseenter="menu.hoverState = true"
            @mouseleave="menu.hoverState = false"
            :style="changeBackground(menu)"
            class="menu-button">

                <!-- If a submenu exists, make a sub-menuitem; else, make a router-link -->
                <a v-if="Object.getOwnPropertyNames(menu.subMenu).length > 1"
                   :id="'main-menu-item-' + index"

                   role="menuitem"
                   aria-haspopup="true"
                   :aria-expanded="menu.open ? 'true' : 'false'"
                   :tabindex="index === 0 || index === focusedIndex ? '0' : '-1'"

                   @click="menu.open ? closeMainMenuFlyOut(menu, index, false) : openMainMenuFlyOut(menu, false)"
                   @keydown.enter.prevent="menu.open ? closeMainMenuFlyOut(menu, index, true) : openMainMenuFlyOut(menu, true)"
                   @keydown.space="menu.open ? closeMainMenuFlyOut(menu, index, true) : openMainMenuFlyOut(menu, true)"
                   @keydown.right="menu.open ? focusToFlyOut(menu) : openMainMenuFlyOut(menu, true)"
                   @keydown.left="menu.open ? focusToFlyOut(menu, true) : openMainMenuFlyOut(menu, true, true)"
                   @keydown.up.prevent="moveUp"
                   @keydown.down.prevent="moveDown"
                   @keydown.home.prevent.native="focusedIndex = 0"
                   @keydown.end.prevent.native="focusedIndex = menuItems.length - 1"
                   @keydown.alphabet="focusByLetter($event.key, index)"

                   v-focus="index === focusedIndex"
                   @focus="focusedIndex = index">
                    <span class="menu-button-content"
                          tabindex="-1">
                        {{ menu.name }}&nbsp;
                    </span>
                </a>
                <router-link v-else :to="'/' + menu.name.toLowerCase()"
                             :id="'main-menu-item-' + index"

                             role="link"
                             aria-haspopup="false"
                             :tabindex="index === 0 || index === focusedIndex ? '0' : '-1'"
                             @keydown.down.prevent.native="moveDown"
                             @keydown.up.prevent.native="moveUp"
                             @keydown.alphabet.native="focusByLetter($event.key, index)"

                             v-focus="index === focusedIndex"
                             @focus.native="focusedIndex = index">
                    <span class="menu-button-content" tabindex="-1"> <!-- TODO: get ride of this hacky &nbsp; -->
                        {{ menu.name }}&nbsp;
                    </span>
                </router-link>

                <transition name="submenu-slide">
                    <fly-out-menu
                              class="submenu"
                              :class="{ active: menu.active, open: menu.open, hidden: menu.hidden }"
                              v-show="menu.open || menu.active"
                              v-bind:menu="menu"
                              v-on:activateMenu="toggleActiveMenu"
                              v-on:toggleOpen="openMainMenuFlyOut"
                              v-on:closeMainMenuFlyOut="closeMainMenuFlyOut">
                    </fly-out-menu>
                </transition>
        </li>
    </ul>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { MainMenuItem } from '@/classes/MainMenuItem';
import FlyOutMenu from '@/components/FlyOutMenu';
import { mixin as focusMixin } from 'vue-focus';
import { SubmenuLink } from '../classes/SubmenuLink';

@Component({
    mixins: [focusMixin],
    components: {
        FlyOutMenu,
    },
})

// Main navigation
export default class MainMenu extends Vue {
    @Prop() private menuItems!: MainMenuItem[]; // Main Menu Items
    @Prop() private focusedIndex!: number; // Index of the focused menu item

    constructor() { super(); }

    // Emits an open event to the parent
    @Emit('open') public open(item: MainMenuItem, keyboardEvent: boolean): void {
        /* TODO: tslint fix - 'no-empty blocks' */
    }
    // Changes the background color of a menu item based on its hover state
    // parameter(s) needed:

    //      menuitem = menu item to be changed
    public changeBackground(menuItem: MainMenuItem): {} {
        let bg = {};

        if (menuItem.hoverState || menuItem.open || menuItem.active) {
            bg = { background: 'transparent' };
        } else {
            bg = { background: menuItem.color };
        }

        // If another menu item is open, while this item is active -> show background
        if (menuItem.active) {
            for (const otherItem: MainMenuItem of this.menuItems) {
                if (otherItem.name !== menuItem.name && otherItem.open) {
                    bg = {background: menuItem.color};
                }
            }
        }

        return bg;
    }
    // Closes the flyout submenu for the provided main menu item
    // parameter(s):
    //      menuItem         = parent menu item of the to-be closed flyout submenu
    //      menuItemIndex    = index of the main menu item in the main menu list

    //      wasKeyboardEvent = if the event that called this method was from a keyboard action
    public closeMainMenuFlyOut(menuItem: MainMenuItem, menuItemIndex: number, wasKeyboardEvent?: boolean = false) {
        menuItem.open = false;
        if (menuItem.active) {
            this.toggleActiveMenu(menuItem, false);
        }
        if (wasKeyboardEvent) {
            setTimeout(() => {
                document.getElementById('main-menu-item-' + menuItemIndex).focus(); // FOCUS ON MAIN MENU ITEM
                // TODO: change IDs from 'Publications-menu-item' to 'main-menu-item-1'
            }, 10);
        }
    }
    // Move focus to the provided main menu item's flyout, default focuses on the first menu item of the flyout
    // parameter(s) needed:
    //      menu           = parent menu of the flyout to be focused on

    //      toLastMenuItem = whether or not focus goes to the last menu item; defaults to first menu item
    public focusToFlyOut(menu: MainMenuItem, toLastMenuItem?: boolean = false) {
        const index: number = toLastMenuItem ? Object.keys(menu.subMenu).length - 1 : 0;
        setTimeout(() => {
            document.getElementById(menu.name + '-fly-out-menu-item-' + index.toString()).focus();
        }, 10);
    }
    // Sets the open menu and if the menu to open is already open, it closes
    // parameter(s):
    //      menuItem        = main menu item to be opened or closed
    //      isKeyBoardEvent = whether or not the native DOM event was from a key press or not

    //      toLastMenuItem  = whether or not focus goes to the last menu item; defaults to first menu item
    public openMainMenuFlyOut(menuItem: MainMenuItem,
                              isKeyboardEvent: boolean,
                              toLastMenuItem?: boolean = false): void {
        // Close all flyouts
        for (const menuItem of this.menuItems) {
            menuItem.open = false;
        }

        if (menuItem.subMenu) {
            menuItem.open = true;
            menuItem.hidden = false; // TODO: what is the purpose of hidden?
        } else {
            this.toggleActiveMenu(menuItem);
        }

        if (isKeyboardEvent) {
            this.focusToFlyOut(menuItem, toLastMenuItem);
        }
    }

    // Toggles the active state of main menu item or optionally declares the active state
    // parameter(s):
    //      item    = main menu item
    //      active  = whether or not the main menu item is being actively used
    private toggleActiveMenu(item: MainMenuItem, active?: boolean = !item.active): void {
        // Reset all submenus
        for (const menuItem of this.menuItems) {
            menuItem.active = false;
            menuItem.hidden = true;
            if (Object.keys(menuItem.subMenu).length > 0) {
                this.resetSubmenuLinks(menuItem.subMenu);
            }
        }

        item.active = active;
        item.hidden = false;
    }

    // Resets all submenu links provided to be deactivated
    // parameter(s) needed:
    //      submenu = list of submenu links to be deactivated

    private resetSubmenuLinks(submenu) {
        for (const sectionLink in submenu) {
            if (submenu.hasOwnProperty(sectionLink)) {
                for (const link: SubmenuLink of submenu[sectionLink]) {
                    link.active = false;
                }
            }
        }
    }

    // Move focus down one menu item, or return to first menu item if at the end
    private moveDown() {
        this.focusedIndex = this.focusedIndex === this.menuItems.length - 1 ? 0 : this.focusedIndex + 1;
    }

    // Move focus up one menu item, or return to last menu item if at the first
    private moveUp() {
        this.focusedIndex = this.focusedIndex === 0 ? this.menuItems.length - 1 : this.focusedIndex - 1;
    }

    // Searches through the menu items and moves focus to the next menu item label that starts with the queried letter
    // parameter(s):
    //      queryLetter           = single letter to be queried across menu item labels
    //      currentlyFocusedIndex = index of the menu item that is currently focused
    private focusByLetter(queryLetter: string, currentlyFocusedIndex: number) {
        // If not at the end of the menu...
        if (currentlyFocusedIndex !== this.menuItems.length - 1) {
            for (let i = currentlyFocusedIndex + 1; i < this.menuItems.length; i++) {
                if (this.menuItems[i].name.toLowerCase().startsWith(queryLetter)) {
                    document.getElementById('main-menu-item-' + i).focus();
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    $menuItemHeight: 45px;
    $border: 3px solid black;
    $lefterWidth: 240px;
    $buttonTextCenterAdjustment: 3px;

    li {
        height: $menuItemHeight;
        line-height: calc(#{$menuItemHeight} + #{$buttonTextCenterAdjustment});
        margin: 15px 0;
    }

    li:hover {
        background: transparent;
    }

    a[role=menuitem],
    a[role=link] {
        font-size: 1.75em;
        font-weight: bold;
        line-height: calc(#{$menuItemHeight} + #{$buttonTextCenterAdjustment});
        text-align: right;
        height: $menuItemHeight;
    }

    a[role=menuitem]:focus,
    a[role=link]:focus {
        outline: none;
    }

    a[role=menuitem] span,
    a[role=link] span {
        height: calc(#{$menuItemHeight} - #{$buttonTextCenterAdjustment});
        line-height: $menuItemHeight;
        width: 100%;
    }

    .submenu {
        position: absolute;
        top: 0;
        height: 100%;
        width: 100%;
        left: $lefterWidth !important;
        outline: $border;
        // width: calc(100% - calc(#{$lefterWidth} * 2));
        z-index: -1 !important;
    }

    .open {
        z-index: 4;
    }

    .hidden {
        display: none;
    }

    /* Submenu Transition Animation */
    .submenu-slide-enter {
        z-index: 4;
    }

    .submenu-slide-enter-active {
        transition: all .5s ease;
        z-index: 4;
    }

    .submenu-slide-enter-to {
        z-index: 4;
    }

    .submenu-slide-leave {
        z-index: 4;
    }

    .submenu-slide-leave-active {
        transition: all .5s ease;
        z-index: 4;
    }

    .submenu-slide-leave-to {
        z-index: 4;
        transform: translateX(-$lefterWidth);
    }

    .submenu-slide-enter {
        transform: translateX(-$lefterWidth);
    }
</style>