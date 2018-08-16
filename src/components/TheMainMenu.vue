<template>
    <ul
        id="main-menu"
        role="menubar"
        aria-label="Plenum Main Navigation"
        @mouseover="focusedIndex = -1"
    >
        <li
            v-for="(menu, index) in menuItems"
            :id="menu.name.toLowerCase().replace(' ', '-') + '-main-menu-item'"
            :key="index"

            class="menu-button"
            :style="changeBackground(menu)"

            @mouseenter="menu.hoverState = true"
            @mouseleave="menu.hoverState = false"
        >

            <!-- If a submenu exists, make a sub-menuitem; else, make a router-link -->
            <a
                v-if="Object.getOwnPropertyNames(menu.subMenu).length > 1"
                :id="'main-menu-item-' + index"
                :key="'link-to-' + menu.name.replace(' ', '-')"

                role="menuitem"
                aria-haspopup="true"
                :aria-expanded="menu.open ? 'true' : 'false'"
                :tabindex="index === 0 || index === focusedIndex ? '0' : '-1'"

                v-focus="index === focusedIndex"

                @click="menu.open ? closeMainMenuFlyOut(menu, index, false) : openMainMenuFlyOut(menu, false)"
                @keydown.enter.prevent="menu.open ? closeMainMenuFlyOut(menu, index, true) : openMainMenuFlyOut(menu, true)"
                @keydown.space="menu.open ? closeMainMenuFlyOut(menu, index, true) : openMainMenuFlyOut(menu, true)"
                @keydown.esc="menu.open ? closeMainMenuFlyOut(menu, index, true) : null"
                @keydown.right="menu.open ? focusToFlyOut(menu) : openMainMenuFlyOut(menu, true)"
                @keydown.left="menu.open ? focusToFlyOut(menu, true) : openMainMenuFlyOut(menu, true, true)"
                @keydown.up.prevent="moveUp"
                @keydown.down.prevent="moveDown"
                @keydown.home.prevent.native="focusedIndex = 0"
                @keydown.end.prevent.native="focusedIndex = menuItems.length - 1"
                @keydown.alphabet="focusByLetter($event.key, index)"
                @focus="focusedIndex = index"
            >
                <span
                    class="menu-button-content"
                    tabindex="-1"
                >
                    {{ menu.name }}&nbsp;
                </span>
            </a>
            <router-link
                 v-else :to="'/' + menu.name.toLowerCase()"
                 :id="'main-menu-item-' + index"
                 :key="'link-to-' + menu.name.toLowerCase().replace(' ', '-')"

                 v-focus="index === focusedIndex"

                 role="link"
                 aria-haspopup="false"
                 :tabindex="index === 0 || index === focusedIndex ? '0' : '-1'"

                 @keydown.down.prevent.native="moveDown"
                 @keydown.up.prevent.native="moveUp"
                 @keydown.alphabet.native="focusByLetter($event.key, index)"
                 @focus.native="focusedIndex = index"
            >
                <span
                    class="menu-button-content"
                    tabindex="-1"
                > <!-- TODO: get ride of this hacky &nbsp; -->
                    {{ menu.name }}&nbsp;
                </span>
            </router-link>

            <transition name="submenu-slide">
                <main-menu-fly-out
                          v-show="menu.open || menu.active"

                          class="submenu"
                          :class="{ active: menu.active, open: menu.open, hidden: menu.hidden }"
                          :menu="menu"

                          @activateMenu="toggleActiveMenu"
                          @toggleOpen="openMainMenuFlyOut"
                          @closeMainMenuFlyOut="closeMainMenuFlyOut"
                          @openArticle="openArticle"
                >
                </main-menu-fly-out>
            </transition>
        </li>
    </ul>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { MainMenuItem } from '@/classes/MainMenuItem';
import MainMenuFlyOut from '@/components/MainMenuFlyOut';
import { mixin as focusMixin } from 'vue-focus';
import { SubmenuLink } from '../classes/SubmenuLink';

@Component({
    mixins: [focusMixin],
    components: {
        MainMenuFlyOut,
    },
})

// Main navigation
export default class TheMainMenu extends Vue {
    @Prop() private menuItems!: MainMenuItem[]; // Main Menu Items
    private focusedIndex: number = -1; // Index of the focused menu item; Initialize to non-existant index value

    constructor() { super(); }

    // Emits an open event to the parent
    @Emit('open') public open(item: MainMenuItem, keyboardEvent: boolean): void {
        /* TODO: tslint fix - 'no-empty blocks' */
    }

    public openArticle(menu: MainMenuItem, routerLinkLocation: string) {
        this.closeMainMenuFlyOut(menu, null, false); // TODO: get 'true' via parameters
        this.$router.push(routerLinkLocation);
    }

    public getIndexOfMenuItem(menu: MainMenuItem): number {
        let index = -1;
        for (let i = 0; i < this.menuItems.length - 1; i++) {
            if (this.menuItems[i].name === menu.name) {
                index = i;
            }
        }

        return index;
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

    // Closes the flyout submenu for the provided main menu item and optionally moves focus to the parent menu item
    // parameter(s):
    //      menuItem         = parent menu item of the to-be closed flyout submenu
    //      menuItemIndex    = index of the main menu item in the main menu list
    //      wasKeyboardEvent = if the event that called this method was from a keyboard action
    public closeMainMenuFlyOut(menuItem: MainMenuItem,
                               menuItemIndex: number,
                               returnFocusToMainMenuItem?: boolean = false) {
        if (menuItemIndex === null) {
            menuItemIndex = this.getIndexOfMenuItem(menuItem);
        }
        if (menuItem.active) {
            this.toggleActiveMenu(menuItem, false);
        }
        this.menuItems[menuItemIndex].open = false;
        if (returnFocusToMainMenuItem) {
            setTimeout(() => {
                this.focusedIndex = menuItemIndex;
                // document.getElementById('main-menu-item-' + menuItemIndex).focus(); // FOCUS ON MAIN MENU ITEM
                // TODO: change IDs from 'Publications-menu-item' to 'main-menu-item-1'
            }, 10);
        } else {
            this.focusedIndex = -1;
        }

        this.resetSubmenuLinks(menuItemIndex);
    }

    // Sets the open menu and if the menu to open is already open, it closes
    // parameter(s):
    //      menuItem        = main menu item to be opened or closed
    //      isKeyBoardEvent = whether or not the native DOM event was from a key press or not
    //      toLastMenuItem  = whether or not focus goes to the last menu item; defaults to first menu item
    public openMainMenuFlyOut(menuItem: MainMenuItem,
                              isKeyboardEvent: boolean,
                              toLastMenuItem?: boolean = false): void {
        const index: number = this.getIndexOfMenuItem(menuItem);
        // Close all flyouts
        for (const menuItem of this.menuItems) {
            this.menuItems[index].open = false;
        }

        if (menuItem.subMenu) {
            this.menuItems[index].open = true;
            this.menuItems[index].hidden = false; // TODO: what is the purpose of hidden?
        } else {
            this.toggleActiveMenu(menuItem);
        }

        if (isKeyboardEvent) {
            this.focusToFlyOut(menuItem, toLastMenuItem);
        }
    }

    // Move focus to the provided main menu item's flyout, default focuses on the first menu item of the flyout
    // parameter(s) needed:
    //      menu           = parent menu of the flyout to be focused on
    //      toLastMenuItem = whether or not focus goes to the last menu item; defaults to first menu item
    private focusToFlyOut(menu: MainMenuItem, toLastMenuItem?: boolean = false) {
        const index: number = toLastMenuItem ? Object.keys(menu.subMenu).length - 1 : 0;
        setTimeout(() => {
            document.getElementById(menu.name + '-fly-out-menu-item-' + index.toString()).focus();
        }, 10);
    }

    // Toggles the active state of main menu item or optionally declares the active state
    // parameter(s):
    //      item    = main menu item
    //      active  = whether or not the main menu item is being actively used
    private toggleActiveMenu(item: MainMenuItem, active?: boolean = !item.active): void {
        // Reset all submenus
        const index: number = this.getIndexOfMenuItem(item);

        this.menuItems[index].active = active;


        for (let i = 0; i < this.menuItems.length; i++) {
            if (i !== index) {
                this.menuItems[i].active = false;
                this.menuItems[i].hidden = true;
            } else {
                if (Object.keys(this.menuItems[index].subMenu).length > 0) {
                    this.resetSubmenuLinks(index);
                }
            }
        }

        this.menuItems[index].hidden = false;
    }

    // Resets all submenu links provided to be deactivated
    // parameter(s) needed:
    //      submenu = list of submenu links to be deactivated
    private resetSubmenuLinks(mainMenuItemIndex: number) {
        for (const submenuItemKey: string in this.menuItems[mainMenuItemIndex].subMenu) {
            if (this.menuItems[mainMenuItemIndex].subMenu.hasOwnProperty(submenuItemKey)) {
                for (let j = 0; j < this.menuItems[mainMenuItemIndex].subMenu[submenuItemKey].length; j++) {
                    this.menuItems[mainMenuItemIndex].subMenu[submenuItemKey][j].active = false;
                    this.menuItems[mainMenuItemIndex].subMenu[submenuItemKey][j].hovered = false;
                    this.menuItems[mainMenuItemIndex].subMenu[submenuItemKey][j].hidden = true;
                    // console.log(
                    //     this.menuItems[index].subMenu[submenuItemKey][j].title
                    //     + ' '
                    //     + this.menuItems[index].subMenu[submenuItemKey][j].active);
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
        transition: all .4s ease;
        z-index: 4;
    }

    .submenu-slide-enter-to {
        z-index: 4;
    }

    .submenu-slide-leave {
        z-index: 4;
    }

    .submenu-slide-leave-active {
        transition: all .4s ease;
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