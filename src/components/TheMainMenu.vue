<template>
    <ul
        class="main-menu"
        role="menubar"
        aria-label="Plenum Main Navigation"

        @mouseover="focusedIndex = -1"
    >
        <li
            v-for="(menu, index) in menuItems"
            :id="menu.name.toLowerCase().replace(' ', '-') + '-main-menu-item'"
            :key="index"

            class="main-menu__menu-item menu-button"
            :style="changeBackground(menu)"

            @mouseenter="menu.hoverState = true"
            @mouseleave="menu.hoverState = false"
        >

            <!-- If a submenu exists, make a sub-menuitem; else, make a router-link -->
            <a
                v-if="menu.subMenu && Object.getOwnPropertyNames(menu.subMenu).length > 1"
                :id="'main-menu-item-' + index"
                :key="'link-to-' + menu.name.replace(' ', '-')"

                role="menuitem"
                aria-haspopup="true"
                :aria-expanded="menu.open ? 'true' : 'false'"
                :tabindex="index === focusedIndex || (allFlyOutsAreClosed && index === 0) ? '0' : '-1'"

                v-focus="index === focusedIndex"

                @click="menu.open ? closeMainMenuFlyOut(menu, index, false) : openMainMenuFlyOut(menu, false)"
                @keydown.enter.prevent="menu.open ? closeMainMenuFlyOut(menu, index, true) : openMainMenuFlyOut(menu, true)"
                @keydown.space="menu.open ? closeMainMenuFlyOut(menu, index, true) : openMainMenuFlyOut(menu, true)"
                @keydown.esc="menu.open ? closeMainMenuFlyOut(menu, index, true) : null"
                @keydown.right="menu.open ? focusToFlyOut(menu) : openMainMenuFlyOut(menu, true)"
                @keydown.left="menu.open ? focusToFlyOut(menu, true) : openMainMenuFlyOut(menu, true, true)"
                @keydown.up.prevent="moveUp"
                @keydown.down.prevent="moveDown"
                @keydown.home.prevent="focusedIndex = 0"
                @keydown.end.prevent="focusedIndex = menuItems.length - 1"
                @keydown.tab="focusedIndex = 0"
                @keydown.alphabet="focusByLetter($event.key, index)"
                @focus="focusedIndex = index"
            >
                <span
                    class="main-menu__menu-item-content menu-button-content"
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

                 @click.prevent.native="activateRouterLink('/' + menu.name.toLowerCase())"
                 @keydown.right.prevent.native="activateRouterLink('/' + menu.name.toLowerCase())"
                 @keydown.enter.prevent.native="activateRouterLink('/' + menu.name.toLowerCase())"
                 @keydown.down.prevent.native="moveDown"
                 @keydown.up.prevent.native="moveUp"
                 @keydown.alphabet.native="focusByLetter($event.key, index)"
                 @focus.native="focusedIndex = index"
            >
                <span
                    class="main-menu__menu-item-content menu-button-content"
                    tabindex="-1"
                > <!-- TODO: get ride of this hacky &nbsp; -->
                    {{ menu.name }}&nbsp;
                </span>
            </router-link>

            <transition name="fly-out-slide">
                <main-menu-fly-out
                    v-show="menu.open"
                    class="fly-out"
                    :class="{ 'fly-out--open': menu.open, 'fly-out--hidden': menu.hidden }"
                    :menu="menu"

                    @activateMenu="openMainMenuFlyOut"
                    @toggleOpen="openMainMenuFlyOut"
                    @closeMainMenuFlyOut="closeMainMenuFlyOut"
                    @openArticle="openArticle"
                    @collectionActivated="incrementPagesVisited"
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

    // Number of times a submenu link has been clicked, and therefore a new page was loaded
    private focusedIndex: number; // Index of the focused menu item; Initialize to non-existent index value
    private pagesVisited: number; // The number of pages visited in one menu session
    // TODO: create a 'endMenuSession' method that runs a reset and proceed procedure

    constructor() {
        super();
        this.focusedIndex = -1;
        this.pagesVisited = 0;
    }

    // Emits an open event to the parent
    @Emit('open')
    public open(item: MainMenuItem, keyboardEvent: boolean): void {
        /* TODO: tslint fix - 'no-empty blocks' */
    }

    // Returns whether or not all of the fly out submenus are closed
    private get allFlyOutsAreClosed() {
        let openFlag: boolean = true;
        for (let i = 0; i < this.menuItems.length; i++) {
            if (this.menuItems[i].open) {
                openFlag = false;
            }
        }
        return openFlag;
    }

    // Closes all of the fly out menus
    public closeAllFlyOuts(): void {
        this.routerBackToPreviousPage();

        for (let i = 0; i < this.menuItems.length; i++) {
            if (this.menuItems[i].open) {
                this.toggleOpenMenu(this.menuItems[i], false);
                this.menuItems[i].open = false;
            }
        }
    }

    // Opens the provided URL
    private activateRouterLink(routerURL: string): void {
        this.$router.push(routerURL);
    }

    // TODO: DOES NOT BELONG IN MAIN MENU
    // The procedure to open an article
    // parameter(s) needed:
    //      menu                = a main menu item
    //      routerLinkLocation  = a url endpoint
    private openArticle(menu: MainMenuItem, routerLinkLocation: string) {
        this.pagesVisited = 0;
        this.closeMainMenuFlyOut(menu, null, false); // TODO: get 'true' via parameters
        this.$router.push(routerLinkLocation);
    }

    // Changes the background color of a menu item based on its hover state
    // parameter(s) needed:
    //      menuitem = menu item to be changed
    private changeBackground(menuItem: MainMenuItem): {} {
        let bg = {};

        if (menuItem.hoverState || menuItem.open) {
            bg = { background: 'transparent' };
        } else {
            bg = { background: menuItem.color };
        }

        // If another menu item is open, while this item is active -> show background
        if (menuItem.open) {
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
    private closeMainMenuFlyOut(menuItem: MainMenuItem,
                                menuItemIndex: number,
                                returnFocusToMainMenuItem?: boolean = false) {
        if (menuItem.open) {
            this.toggleOpenMenu(menuItem, false);
        } else {
            this.resetSubmenuLinks(menuItemIndex);
        }

        if (menuItemIndex === null) {
            menuItemIndex = this.getIndexOfMenuItem(menuItem);
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

        this.routerBackToPreviousPage();
    }

    // Sets the open menu and if the menu to open is already open, it closes
    // parameter(s):
    //      menuItem        = main menu item to be opened or closed
    //      isKeyBoardEvent = whether or not the native DOM event was from a key press or not
    //      toLastMenuItem  = whether or not focus goes to the last menu item; defaults to first menu item
    private openMainMenuFlyOut(menuItem: MainMenuItem,
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
            this.toggleOpenMenu(menuItem);
        }

        if (isKeyboardEvent) {
            this.focusToFlyOut(menuItem, toLastMenuItem);
        }

    }

    // Calls the router to go back in history to the page that was loaded before a menu session
    private routerBackToPreviousPage(): void {
        if (this.pagesVisited > 0) {
            this.$router.go(this.pagesVisited * -1);
            this.pagesVisited = 0;
        }
    }

    // Increments the number of pages visited during a menu session
    private incrementPagesVisited(submenuLink: SubmenuLink): void {
        this.pagesVisited++;
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
    //      open  = whether or not the main menu item's fly out is open
    private toggleOpenMenu(item: MainMenuItem, open?: boolean = !item.open): void {
        // Reset all submenus
        const index: number = this.getIndexOfMenuItem(item);

        this.menuItems[index].open = open;


        for (let i = 0; i < this.menuItems.length; i++) {
            if (i !== index) {
                this.menuItems[i].open = false;
                this.menuItems[i].hidden = true;
            } else {
                if (this.menuItems[index].subMenu && Object.keys(this.menuItems[index].subMenu).length > 0) {
                    this.resetSubmenuLinks(index);
                }
            }
        }

        this.menuItems[index].hidden = false;
    }

    // Resets all submenu links provided to be deactivated
    // parameter(s) needed:
    //      mainMenuItemIndex = the locational index of a main menu item
    private resetSubmenuLinks(mainMenuItemIndex: number) {
        for (const submenuItemKey: string in this.menuItems[mainMenuItemIndex].subMenu) {
            if (this.menuItems[mainMenuItemIndex].subMenu.hasOwnProperty(submenuItemKey)) {
                for (let j = 0; j < this.menuItems[mainMenuItemIndex].subMenu[submenuItemKey].length; j++) {
                    this.menuItems[mainMenuItemIndex].subMenu[submenuItemKey][j].previewVisible = false;
                    this.menuItems[mainMenuItemIndex].subMenu[submenuItemKey][j].active = false;
                    this.menuItems[mainMenuItemIndex].subMenu[submenuItemKey][j].hidden = true;
                }
            }
        }
    }

    // Returns the locational index of the provided menu item
    // parameter(s) needed:
    //      menuItem = a main menu item
    private getIndexOfMenuItem(menuItem: MainMenuItem): number {
        let index = -1;
        for (let i = 0; i < this.menuItems.length - 1; i++) {
            if (this.menuItems[i].name === menuItem.name) {
                index = i;
            }
        }

        return index;
    }

    // Setter for the data of the index of the focused menu item
    // parameter(s) needed:
    //      newVal = the new value from which to set
    private setFocusedIndex(newVal: number): void {
        this.focusedIndex = newVal;
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

    .main-menu__menu-item {
        height: $menuItemHeight;
        margin: 15px 0;

        line-height: calc(#{$menuItemHeight} + #{$buttonTextCenterAdjustment});
    }

    .main-menu__menu-item:hover {
        background: transparent;
    }

    .main-menu__menu-item a[role=menuitem],
    .main-menu__menu-item a[role=link] {
        height: $menuItemHeight;

        font-size: 1.75em;
        font-weight: bold;
        line-height: calc(#{$menuItemHeight} + #{$buttonTextCenterAdjustment});
        text-align: right;
    }

    .main-menu__menu-item a[role=menuitem]:focus,
    .main-menu__menu-item a[role=link]:focus {
        outline: none;
    }

    .main-menu__menu-item-content,
    .main-menu__menu-item-content {
        width: 100%;
        height: calc(#{$menuItemHeight} - #{$buttonTextCenterAdjustment});
        line-height: $menuItemHeight;
    }

    .fly-out {
        position: absolute;
        top: 0;
        height: 100%;
        width: 100%;
        left: $lefterWidth !important;
        outline: $border;
        // width: calc(100% - calc(#{$lefterWidth} * 2));
        z-index: -1 !important;
    }

    .fly-out--open {
        z-index: 4;
    }

    .fly-out--hidden {
        display: none;
    }

    /* Submenu Transition Animation */
    .fly-out-slide-enter {
        z-index: 4;
    }

    .fly-out-slide-enter-active {
        transition: all .4s ease;
        z-index: 4;
    }

    .fly-out-slide-enter-to {
        z-index: 4;
    }

    .fly-out-slide-leave {
        z-index: 4;
    }

    .fly-out-slide-leave-active {
        transition: all .4s ease;
        z-index: 4;
    }

    .fly-out-slide-leave-to {
        z-index: 4;
        transform: translateX(-$lefterWidth);
    }

    .fly-out-slide-enter {
        transform: translateX(-$lefterWidth);
    }
</style>