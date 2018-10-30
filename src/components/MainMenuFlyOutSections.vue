<template>
    <ul
        :aria-labelledby="menuTitle"
        class="collection-group-menu"
        role="menu"
        @mouseover="focusedIndex = -1"
    >
        <li
            v-for="(menuLink, index) in menuItems"
            :key="index"

            class="collection-group-menu__menu-item"
            role="none"
        >
            <router-link
                v-if="menuLink.articles"
                :to="'/' + parentMenu.title.toLowerCase() +
                     '/' + menuLink.title.replace(new RegExp(' ', 'g'), '-').toLowerCase()"

                :id="menuTitle.replace(' ', '') + '-section-menu-item-' + index"

                class="focusable"

                role="menuitem"
                aria-haspopup="true"
                :aria-expanded="menuLink.expanded ? 'true' : 'false'"
                :tabindex="index === focusedIndex ? '0' : '-1'"

                v-focus="index === focusedIndex"

                @mouseover.native="menuLink.hovered = true"
                @mouseleave.native="menuLink.hovered = false"
                @click.native="handleCollectionLinkActivation(parentMenu, menuTitle, menuLink, false)"
                @keydown.enter.prevent.native="menuLink.expanded ? focusToTOC(menuLink) : handleCollectionLinkActivation(parentMenu, menuTitle, menuLink, true)"
                @keydown.right.prevent.native="menuLink.expanded ? focusToTOC(menuLink) : handleCollectionLinkActivation(parentMenu, menuTitle, menuLink, true)"
                @keydown.space.prevent.native="menuLink.expanded ? focusToTOC(menuLink) : handleCollectionLinkActivation(parentMenu, menuTitle, menuLink, true)"
                @keydown.esc.prevent.native="exitMenu(menuTitle)"
                @keydown.left.prevent.native="exitMenu(menuTitle)"
                @keydown.down.prevent.native="moveDown"
                @keydown.up.prevent.native="moveUp"
                @keydown.home.prevent.native="focusedIndex = 0"
                @keydown.end.prevent.native="focusedIndex = menuItems.length - 1"
                @focus.prevent.native="focusOnMenuItem(index)"
            >
                <span
                    class="collection-group-menu__menu-item-content focusable__content"
                    :class="{ 'collection-group-menu__menu-item-content--active': menuLink.expanded }"
                    tabindex="-1"
                >
                    {{ menuLink.title }}&nbsp;
                </span>

            </router-link>
            <router-link
                v-else
                :to="'/' + parentMenu.title.toLowerCase() +
                     '/' + menuLink.title.replace(new RegExp(' ', 'g'), '-').toLowerCase()"

                :tabindex="index === focusedIndex ? '0' : '-1'"

                class="focusable"

                role="menuitem"
                aria-haspopup="false"

                v-focus="index === focusedIndex"

                @mouseover.native="menuLink.hovered = true"
                @mouseleave.native="menuLink.hovered = false"
                @click.native="handleLinkActivation()"
                @keydown.enter.prevent.native="menuLink.expanded ? focusToTOC(menuLink) : handleLinkActivation(parentMenu, menuTitle, menuLink, true)"
                @keydown.right.prevent.native="menuLink.expanded ? focusToTOC(menuLink) : handleLinkActivation(parentMenu, menuTitle, menuLink, true)"
                @keydown.space.prevent.native="menuLink.expanded ? focusToTOC(menuLink) : handleLinkActivation(parentMenu, menuTitle, menuLink, true)"
                @keydown.esc.prevent.native="exitMenu(menuTitle)"
                @keydown.left.prevent.native="exitMenu(menuTitle)"
                @keydown.down.prevent.native="moveDown"
                @keydown.up.prevent.native="moveUp"
                @keydown.home.prevent.native="focusedIndex = 0"
                @keydown.end.prevent.native="focusedIndex = menuItems.length - 1"
                @focus.prevent.native="focusOnMenuItem(index)"
            >
                <span
                        class="collection-group-menu__menu-item-content focusable__content"
                        :class="{ 'collection-group-menu__menu-item-content--active': menuLink.expanded }"
                        tabindex="-1"
                >
                    {{ menuLink.title }}&nbsp;
                </span>
            </router-link>

            <!-- TODO: Add title bar that includes basic info about the issue (title, editors, published date, download all button?) -->
            <!-- div class="collection-title-bar">

            </div-->
            <!-- TODO move to article preview component? -->
            <transition name="preview-fade">
                <main-menu-fly-out-sections-previews
                    v-show="isPreviewVisible(index)"
                    v-if="menuLink.articles"

                    :sectionMenuItem="menuLink"
                    :parentMenu="parentMenu"

                    @mouseleave.native="toggleOffAllArticleItemHovers(index)"

                    @toggleOpen="toggleOpen"
                    @openArticle="openArticle"
                    @exitMenu="setFocusOnMenuItem"
                ></main-menu-fly-out-sections-previews>
            </transition>
        </li>
    </ul>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import { mixin as focusMixin } from 'vue-focus';
import MainMenuFlyOutSectionsPreviews from './MainMenuFlyOutSectionsPreviews';

@Component({
    mixins: [focusMixin],
    components: {
        MainMenuFlyOutSectionsPreviews,
    },
})

// Submenu associated with a unique main menu entry
export default class MainMenuFlyOutSections extends Vue {
    @Prop(Array) private menuItems!: Array<any>; // Parent sectionMenu item
    @Prop(String) private menuTitle!: string; // Title of the fly out's menu parent
    @Prop(Object) private parentMenu!: any; // Parent menu of theses fly out sections
    private focusedIndex: number;

    constructor() {
        super();
        this.focusedIndex = -1;
    }

    @Emit('handleCollectionLinkActivation')
    public handleCollectionLinkActivation(mainMenuParent: Object,
                               sectionTitle: string,
                               submenuLink: Object): void {
        this.collectionActivated(submenuLink);
    }

    @Emit('toggleOpen')
    public toggleOpen(mainMenuItem: any): void {}

    @Emit('openArticle')
    public openArticle(): void {
        this.resetFocus();
    }

    @Emit('collectionActivated')
    public collectionActivated(submenuLink: any): void {}

    // TODO: decouple link activation to accomodate non-collections/non-articles for page links in menu
    private handleLinkActivation(): void {
        this.openArticle();
    }

    // Returns whether or not the collection preview should be visible
    // parameter(s) needed:
    //      menuItemIndex = the index location of the menu item in the menu list
    private isPreviewVisible(menuItemIndex: number): boolean {
        return this.menuItems[menuItemIndex].expanded ||
            this.menuItems[menuItemIndex].hovered ||
            this.focusedIndex === menuItemIndex;
    }

    // Turn off all toggled on hover attributes of the table of content entries in order to hide the article previews
    // and return the preview to the collection image
    //      index = the index location of the menu item in the menu list
    private toggleOffAllArticleItemHovers(index: number): void {
        let foundItem = this.menuItems.find(item => item.expanded);
        if (foundItem) {
            this.menuItems.find(item => item.expanded).articles.forEach(article => article.previewVisible = false);
        }
    }

    /*********************************/
    /* KEYBOARD NAVIGATION FUNCTIONS */
    /*********************************/

    // Send focus to a specific collection menu item depending on the provided index number of the menu item
    // parameter:
    //      index = the index location of the menu item in the menu list
    private focusOnMenuItem(index: number) {
        this.focusedIndex = index;
    }

    // Move focus to the provided main menu item's flyout, default focuses on the first menu item of the flyout
    // parameter(s) needed:
    //      menu           = parent menu of the flyout to be focused on
    private focusToTOC(submenuLink: any) {
        setTimeout(() => {
            document.getElementById(submenuLink.title.replace(' ', '') + '-entry-0').focus();
        }, 5);
    }

    // Focus on the provided submenu link
    private setFocusOnMenuItem(parentMenu: any) {
        for (let index = 0; index <= this.menuItems.length - 1; index++) {
            if (this.menuItems[index] === parentMenu) {
                const focusedIndex = this.focusedIndex === -1 ? 0 : this.focusedIndex;
                const elementID: string = this.menuTitle.replace(' ', '') +
                    '-section-menu-item-' +
                    focusedIndex.toString();
                document.getElementById(elementID).focus();
            }
        }
    }

    // Moves focus to this menu parent menu item (the menu title)
    private exitMenu() {
        const parentMenuItems: string[] = Object.keys(this.parentMenu.submenu);
        for (let i = 0; i <= parentMenuItems.length - 1; i++) {
            if (parentMenuItems[i] === this.menuTitle) {
                document.getElementById(this.parentMenu.title + '-fly-out-menu-item-' + i).focus();
            }
        }
        // document.getElementById(parentMenuItems.find((parentMenuItem) => {
        //     console.log(parentMenuItem);
        //     return parentMenuItem === this.menuTitle;
        // })).focus();
        this.resetMenuItems();
        this.resetFocus();
    }

    private resetFocus(): void {
        this.focusedIndex = -1;
    }

    private resetMenuItems(): void {
        for (let i = 0; i < this.menuItems.length; i++) {
            // this.menuItems[i].expanded = false;
            this.menuItems[i].hidden = true;
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
}
</script>

<style lang="scss" scoped>
    @import '../styles/_settings';

    $preview-width: calc(100vw - (#{$navBarWidth} * 2) - 3px);
    $preview-height: 90vh;
    $menuItemFontSize: calc(#{$flyoutFontSize} - 0.25em);

    .collection-group-menu {
        //padding-top: 0.25em;
    }

    .collection-group-menu__menu-item {
        font-size: 1.75em;
        height: $flyoutFontSize;
    }

    .collection-group-menu__menu-item a {
        height: $flyoutFontSize;
        text-decoration: none;
        outline: none;
    }

    .collection-group-menu__menu-item a span {
        font-size: $menuItemFontSize;
    }

    .collection-group-menu__menu-item[role=menuitem] * {
        width: 100%;
        height: 100%;
    }

    .collection-group-menu__menu-item-content {
        // Adds a 2px padding to the menu item to accommodate a black border upon activation
        border-right: 2px solid transparent;
    }

    .collection-group-menu__menu-item-content--active {
        border-right: 2px solid black;
    }

    .collection-group-menu__menu-item-content:hover,
    .collection-group-menu__menu-item-content--active {
        background: rgba(0, 0, 0, 0.05);
    }

    .collection-title-bar {
        width: $preview-width;
        height: calc(100vh - #{$preview-height});
    }

    /* APPEAR TRANSITION */
    .preview-fade-enter {
        opacity: 0.75;
        /*z-index: 3 !important;*/
    }

    .preview-fade-enter-active {
        transition: opacity 200ms ease-in;
        /*z-index: 3 !important;*/
    }

    .preview-fade-enter-to {
        opacity: 1;
        //z-index: 2 !important;
    }

    .preview-face-leave {
        opacity: 1;
        //z-index: 2 !important;
    }

    .preview-fade-leave-active {
        transition: opacity 200ms ease-out;
        //z-index: 2 !important;
    }

    .preview-fade-leave-to {
        opacity: 0;
        //z-index: 1 !important;
    }
</style>