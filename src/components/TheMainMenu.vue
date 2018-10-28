<template>
    <ul
        class="main-menu"
        :class="navHovered ? 'main-menu--expanded' : null"
        role="menubar"
        aria-label="Plenum Main Navigation"

        @mouseover="handleNavHoverEvent()"
        @mouseleave="navHovered = false"
    >
        <li
            v-for="(menu, index) in menuItems"
            :id="menu.title.toLowerCase().replace(' ', '-') + '-main-menu-item'"
            :key="index"

            class="main-menu__menu-item menu-button"
            :class="menu.disabled ? 'main-menu__menu-item--disabled' : null"
            :style="changeBackground(menu)"

            @mouseenter="handleMenuItemHoverEvent($event, menu)"
            @mouseleave="handleMenuItemHoverEvent($event, menu)"
        >

            <!-- If a submenu exists, make a sub-menuitem; else, make a router-link -->
            <a
                v-if="menu.submenu && Object.getOwnPropertyNames(menu.submenu).length > 1"
                :id="'main-menu-item-' + index"
                :key="'link-to-' + menu.title.replace(' ', '-')"

                role="menuitem"
                aria-haspopup="true"
                :aria-expanded="menu.expanded.toString()"
                :tabindex="index === focusedIndex || (allFlyOutsAreClosed && index === 0) ? '0' : '-1'"

                v-focus="index === focusedIndex"

                @click="menu.expanded ? closeMainMenuFlyOut(menu, index, false) : openMainMenuFlyOut(menu, false)"
                @keydown.enter.prevent="menu.expanded ? closeMainMenuFlyOut(menu, index, true) : openMainMenuFlyOut(menu, true)"
                @keydown.space="menu.expanded ? closeMainMenuFlyOut(menu, index, true) : openMainMenuFlyOut(menu, true)"
                @keydown.esc="menu.expanded ? closeMainMenuFlyOut(menu, index, true) : null"
                @keydown.right="menu.expanded ? focusToFlyOut(menu) : openMainMenuFlyOut(menu, true)"
                @keydown.left="menu.expanded ? focusToFlyOut(menu, true) : openMainMenuFlyOut(menu, true, true)"
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
                ><!-- TODO: get ride of this hacky &nbsp; next to menu title -->
                    {{ menu.title }}&nbsp;
                </span>
            </a>
            <router-link
                 v-else
                 :to="'/' + menu.title.toLowerCase()"
                 :id="'main-menu-item-' + index"
                 :key="'link-to-' + menu.title.toLowerCase().replace(' ', '-')"

                 v-focus="index === focusedIndex"

                 role="link"
                 aria-haspopup="false"
                 :tabindex="index === 0 || index === focusedIndex ? '0' : '-1'"

                 @click.prevent.native="openContent('/' + menu.title.toLowerCase(), false)"
                 @keydown.right.prevent.native="openContent('/' + menu.title.toLowerCase())"
                 @keydown.enter.prevent.native="openContent('/' + menu.title.toLowerCase())"
                 @keydown.down.prevent.native="moveDown"
                 @keydown.up.prevent.native="moveUp"
                 @keydown.alphabet.native="focusByLetter($event.key, index)"
                 @focus.native="focusedIndex = index"
            >
                <span
                    class="main-menu__menu-item-content menu-button-content"
                    tabindex="-1"
                >
                    {{ menu.title }}&nbsp;
                </span>
            </router-link>

            <transition name="fly-out-slide">
                <main-menu-fly-out
                    v-show="menu.expanded"
                    class="fly-out"
                    :class="{ 'fly-out--open': menu.expanded, 'fly-out--hidden': menu.hidden }"
                    :menu="menu"

                    @activateMenu="openMainMenuFlyOut"
                    @toggleOpen="openMainMenuFlyOut"
                    @closeMainMenuFlyOut="closeMainMenuFlyOut"
                    @openArticle="openContent"
                    @collectionActivated="incrementPagesVisited"
                >
                </main-menu-fly-out>
            </transition>
        </li>
    </ul>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import MainMenuFlyOut from '@/components/MainMenuFlyOut';
import { mixin as focusMixin } from 'vue-focus'; // ignore 'cannot resolve' error


@Component({
    mixins: [focusMixin],
    components: {
        MainMenuFlyOut,
    },
})

// Main navigation
export default class TheMainMenu extends Vue {
    @Prop(Array) private menuItems!: Array<any>; // Main Menu Items
    private navHovered: boolean;

    // Number of times a submenu link has been clicked, and therefore a new page was loaded
    private focusedIndex: number; // Index of the focused menu item; Initialize to non-existent index value

    constructor() {
        super();
        this.focusedIndex = -1;
        this.navHovered = false;
    }

    // The procedure to open an article
    // parameter(s) needed:
    //      routerLinkLocation  = a url endpoint of the requested content
    //      keyboardEvent?      = if the open content event was caused by a keyboard, defaults true
    @Emit('openContent')
    private openContent(routerLinkLocation: string, keyboardEvent?: boolean = true) {}

    // Calls the router to go back in history to the page that was loaded before a menu session
    @Emit('revertMenuSession')
    private revertMenuSession(): void {}

    // Returns whether or not all of the fly out submenus are closed
    private get allFlyOutsAreClosed() {
        return !this.menuItems.some((menuItem: any) => menuItem.expanded);
    }

    private handleNavHoverEvent() {
        this.navHovered = true;
        this.focusedIndex = -1;
    }

    private handleMenuItemHoverEvent(event, menu) {
        if (event.type === 'mouseenter') {
            menu.hovered = true;
        } else if (event.type === 'mouseleave') {
            menu.hovered = false;
        } else {
            console.error('incorrectly used function: handleMenuItemHoverEvent in TheMainMenu');
        }
    }

    // Sets the open menu and if the menu to open is already open, it closes
    // parameter(s):
    //      menuItem        = main menu item to be opened or closed
    //      isKeyBoardEvent = whether or not the native DOM event was from a key press or not
    //      toLastMenuItem  = whether or not focus goes to the last menu item; defaults to first menu item
    private openMainMenuFlyOut(menuItem: any,
                               isKeyboardEvent: boolean,
                               toLastMenuItem?: boolean = false): void {
        this.$store.dispatch('menuTree/openMainMenuItem', menuItem);
        if (isKeyboardEvent) {
            this.focusToFlyOut(menuItem, toLastMenuItem);
        }
    }

    // Closes the flyout submenu for the provided main menu item and optionally moves focus to the parent menu item
    // parameter(s):
    //      menuItem         = parent menu item of the to-be closed flyout submenu
    //      menuItemIndex    = index of the main menu item in the main menu list
    //      wasKeyboardEvent = if the event that called this method was from a keyboard action
    private closeMainMenuFlyOut(menuItem: any,
                                menuItemIndex: number,
                                returnFocusToMainMenuItem?: boolean = false) {
        // Returns focus for keyboard navigation
        if (returnFocusToMainMenuItem) {
            setTimeout(() => {
                this.focusedIndex = menuItemIndex;
                // document.getElementById('main-menu-item-' + menuItemIndex).focus(); // FOCUS ON MAIN MENU ITEM
                // TODO: change IDs from 'Publications-menu-item' to 'main-menu-item-1'
            }, 10);
        } else {
            this.focusedIndex = -1;
        }

        this.revertMenuSession();
    }

    // TODO: rename to event handler and does this belong here?
    // Increments the number of pages visited during a menu session
    private incrementPagesVisited(): void {
        this.$store.dispatch('routerNav/pageVisited');
    }

    /*****************/
    /* CSS FUNCTIONS */
    /*****************/

    // Changes the provided menu item background to transparent if the menu item is being hovered over or is active
    // parameter(s) needed:
    //      menuItem = menu item to be changed
    private changeBackground(menuItem): {} {
        //if (!menuItem.disabled) {
            if (menuItem.hovered || menuItem.expanded) {
                return {background: 'white'};
            } else {
                return {background: menuItem.color};
            }
        // } else {
        //      Grayscale version of HCL(..., 25, 90)
        //     return {background: 'rgb(226, 226, 226)'};
        // }
    }

    /*********************************/
    /* KEYBOARD NAVIGATION FUNCTIONS */
    /*********************************/
    // TODO: Find library to handle keyboard navigation, or globalize these functions for each menu

    // Move focus to the provided main menu item's flyout, default focuses on the first menu item of the flyout
    // parameter(s) needed:
    //      menu           = parent menu of the flyout to be focused on
    //      toLastMenuItem = whether or not focus goes to the last menu item; defaults to first menu item
    private focusToFlyOut(menu: any, toLastMenuItem?: boolean = false) {
        const index: number = toLastMenuItem ? Object.keys(menu.submenu).length - 1 : 0;
        setTimeout(() => {
            document.getElementById(menu.title + '-fly-out-menu-item-' + index.toString()).focus();
        }, 10);
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
        // If not at the end of the menu... This logic follows WAI-ARIA keyboard nav standards
        if (currentlyFocusedIndex !== this.menuItems.length - 1) {
            let el = 'main-menu-item-' + this.menuItems
                .slice(currentlyFocusedIndex + 1)
                .findIndex((menuItem: any) => menuItem.title.toLowerCase().startsWith(queryLetter));
            document.getElementById(el).focus();
        }
    }
}
</script>

<style lang="scss" scoped>
    $menuItemHeight: 45px;
    $menuItemWidth: 210px;
    $border: 3px solid black;
    $lefterWidth: 240px;
    $buttonTextCenterAdjustment: 3px;

    .main-menu {
        width: $menuItemHeight;
        left: calc(50% - 45px / 2);
        position: relative;
        overflow: hidden;

        transition: width 0.3s ease;
    }

    .main-menu--expanded {
        width: $menuItemWidth;

        transition: width 0.3s ease;
    }

    .main-menu__menu-item {
        width: calc(#{$lefterWidth} - 15px * 2);
        height: $menuItemHeight;
        margin: 15px 0;

        line-height: calc(#{$menuItemHeight} + #{$buttonTextCenterAdjustment});
    }

    .main-menu__menu-item:first-child {
        margin-top: 0;
    }

    .main-menu__menu-item:last-child {
        margin-bottom: 0;
    }

    .main-menu__menu-item:hover {
        background: transparent;
    }

    .main-menu__menu-item a[role=menuitem],
    .main-menu__menu-item a[role=link] {
        height: $menuItemHeight;

        cursor: pointer;

        line-height: calc(#{$menuItemHeight} + #{$buttonTextCenterAdjustment});
        text-align: right;
    }

    .main-menu__menu-item a[role=menuitem] span,
    .main-menu__menu-item a[role=link] span {
        font-size: 2em;
        font-weight: bold;
    }

    .main-menu__menu-item--disabled a span {
        color: grey;
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