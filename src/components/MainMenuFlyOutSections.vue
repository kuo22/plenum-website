<template>
    <ul
        :aria-labelledby="menuTitle"
        class="submenu-section-menu"
        role="menu"
    >
        <li
            class="menu-button"
            role="none"
            v-for="(menuLink, index) in menuItems"
            :key="index"
        >
            <router-link
                :to="'/' + parentMenu.name.toLowerCase() +
                     '/' + menuLink.title.replace(new RegExp(' ', 'g'), '-').toLowerCase() +
                     '/index'"
                :id="menuTitle.replace(' ','') + '-section-menu-item-' + index"
                :class="{ underlined: menuLink.active }"
                :tabindex="index === 0 || index === focusedIndex ? '0' : '-1'"

                role="menuitem"
                aria-haspopup="true"
                :aria-expanded="menuLink.active ? 'true' : 'false'"

                @mouseover.native="menuLink.hovered = true"
                @mouseleave.native="menuLink.hovered = false"

                @click.native="activateSubmenuLink(parentMenu, menuTitle, menuLink, false)"
                @keydown.enter.prevent.native="menuLink.active ? focusToTOC(menuLink) : activateSubmenuLink(parentMenu, menuTitle, menuLink, true)"
                @keydown.right.prevent.native="menuLink.active ? focusToTOC(menuLink) : activateSubmenuLink(parentMenu, menuTitle, menuLink, true)"
                @keydown.space.prevent.native="menuLink.active ? focusToTOC(menuLink) : activateSubmenuLink(parentMenu, menuTitle, menuLink, true)"
                @keydown.esc.prevent.native="exitMenu(menuTitle)"
                @keydown.left.prevent.native="exitMenu(menuTitle)"
                @keydown.down.prevent.native="moveDown"
                @keydown.up.prevent.native="moveUp"
                @keydown.home.prevent.native="focusedIndex = 0"
                @keydown.end.prevent.native="focusedIndex = menuItems.length - 1"

                v-focus="index === focusedIndex"
                @focus.prevent.native="focusOnMenuItem(index)"
            >
                <span
                    class="menu-button-content"
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
                <div
                    class="collection-preview"
                    :class="{'collection-active': menuLink.active }"
                    v-show="menuLink.active || menuLink.hovered"
                    @mouseleave="toggleOffAllArticleItemHovers(index)"
                    role="presentation"
                > <!--, hovered: menuLink.hovered-->

                    <div class="cover-image-preview preview-half">
                        <div class="preview-content-container">
                            <img
                                 :alt="menuLink.title + ' Cover Image'"
                                 :class="{ 'preview-active': menuLink.active }"
                                 :src="menuLink.coverImageURL"
                            >
                        </div>
                    </div>

                    <div
                        class="toc-preview-container"
                        role="presentation"
                    >
                        <article-previews
                            class="preview-half"
                            v-bind:articles="menuLink.articles"
                            v-bind:parentCollection="menuLink"
                        ></article-previews>
                        <table-of-contents
                                ref="tableOfContents"
                                class="preview-half"
                                v-bind:parentCollection="menuLink"
                                v-bind:mainMenuAncestor="parentMenu"
                                v-on:toggleOpen="toggleOpen"
                                v-on:articleSelected="openArticle"
                                v-on:exitMenu="focusOnSubmenusParentMenuItem"
                        ></table-of-contents>
                    </div>

                </div>
            </transition>
        </li>
    </ul>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import {MainMenuItem} from '@/classes/MainMenuItem';
import {SubmenuLink} from '../classes/SubmenuLink';
import { mixin as focusMixin } from 'vue-focus';
import TableOfContents from '@/components/TableOfContents';
import ArticleTitleCard from './ArticleTitleCard';
import ArticlePreviews from './ArticlePreviews';

@Component({
    mixins: [focusMixin],
    components: {
        ArticlePreviews,
        ArticleTitleCard,
        TableOfContents,
    },
})

// Submenu associated with a unique main menu entry
export default class MainMenuFlyOutSections extends Vue {
    @Prop() private menuItems!: SubmenuLink[]; // Parent sectionMenu item
    @Prop() private menuTitle!: string;
    @Prop() private parentMenu!: MainMenuItem;
    @Prop() private focusedIndex!: number;
    @Prop() private menuItemHovered!: boolean;
    @Prop() private previewImageURL: string = '';

    constructor() { super(); }

    @Emit('activateSubmenuLink')
    public activateSubmenuLink(item: MainMenuItem,
                               menuTitle: string,
                               menuLink: SubmenuLink): void { /* Filler */ }

    @Emit('toggleOpen')
    public toggleOpen(menu: MainMenuItem): void { /* Filler */ }

    @Emit('openArticle')
    public openArticle(menu: MainMenuItem, routerLinkLocation: string): void { /* Filler */ }

    // Turn off all toggled on hover attributes of the table of content entries in order to hide the article previews
    // and return the preview to the collection image
    private toggleOffAllArticleItemHovers(index: number): void {
        for (let i = 0; i < this.menuItems.length; i++) {
            if (this.menuItems[i].active) {
                for (let j = 0; j < this.menuItems[i].articles.length; j++) {
                    this.menuItems[i].articles[j].hovered = false;
                }
            }
        }
        this.menuItems[index].hovered = false;
    }

    // Send focus to a specific collection menu item depending on the provided index number of the menu item
    // parameter:
    //      index: position of the menu item in the menu list
    private focusOnMenuItem(index: number) {
        this.focusedIndex = index;
        this.menuItems[index].hovered = true;
    }

    // Move focus to the provided main menu item's flyout, default focuses on the first menu item of the flyout
    // parameter(s) needed:
    //      menu           = parent menu of the flyout to be focused on
    //      toLastMenuItem = whether or not focus goes to the last menu item; defaults to first menu item
    private focusToTOC(menu: SubmenuLink) {
        setTimeout(() => {
            document.getElementById(menu.title.replace(' ', '') + '-entry-0').focus();
        }, 5);
    }

    // Focus on the provided parental menu item
        // TODO: Rename method
    private focusOnSubmenusParentMenuItem(providedMenuItem: SubmenuLink)  {
        // TODO: make more efficient, all of this jsut to figure out the index of the provided menu item?
        for (let index = 0; index <= this.menuItems.length - 1; index++) {
            if (this.menuItems[index].title === providedMenuItem.title) {
                document.getElementById(this.menuTitle.replace(' ', '') + '-section-menu-item-' + index).focus();
            }
        }
    }

    // Moves focus to this menu parent menu item (the menu title)
    private exitMenu() {
        const parentMenuItems: string[] = Object.keys(this.parentMenu.subMenu);
        for (let i = 0; i <= parentMenuItems.length - 1; i++) {
            if (parentMenuItems[i] === this.menuTitle) {
                document.getElementById(this.parentMenu.name + '-fly-out-menu-item-' + i).focus();
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
}
</script>

<style lang="scss" scoped>
    $viewAllSubMenus: false;
    $lefterWidth: 240px;
    $preview-width: calc(100vw - (#{$lefterWidth} * 2) - 3px);
    $preview-height: 90vh;
    $focusPadding: 8px;

    // TODO: clean up unnecessary css leftover from SubMenu component as template
    a {
        text-decoration: none;
        outline: none;
    }

    a:hover {
        text-decoration: underline;
    }

    a[role=menuitem] {
        // width: calc(100% - #{$focusPadding});
    }

    a[role=menuitem] * {
        // padding-right: #{$focusPadding};
        width: 100%;
        height: 100%;
    }

    .submenu-section-menu .menu-button {
        height: 2.5em;
    }

    .submenu a:hover {
        cursor: pointer;
        text-decoration: underline;
    }

    .submenu-section-menu li {
        line-height: 45px;
    }

    .submenu-active {
        // left: 20px;
        z-index: 4;
    }

    .collection-title-bar {
        width: $preview-width;
        height: calc(100vh - #{$preview-height});
    }

    .toc-preview-container {
        width: $preview-width;
        height: $preview-height;
        position: absolute;
        // background: rgba(255, 255, 255, 0.5);
    }

    .collection-preview {
        display: inline-block;
        position: absolute;
        left: calc(#{$lefterWidth} + 3px); // + outline width
        top: calc(100vh - #{$preview-height});
        width: $preview-width;
        height: $preview-height;
        float: right;
        background: white;
        z-index: 2;
        outline: 3px solid black;
    }

    .collection-preview.collection-active {
        z-index: 1;
    }

    .collection-preview.hovered {
        z-index: 3;
    }

    /* COLLECTION IMAGE AND ARTICLE ABSTRACT PREVIEW START */

    .preview-content-container {
        position: absolute;
        top: 8%;
        left: 4%;
        width: 92%;
        height: 84%;
        transform: translateY(0vh);
        text-align: center;
    }

    .preview-content-container .article-preview {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .preview-content-container img {
        position: relative;
        max-width: 100%;
        max-height: 100%;
        top: 0;
        height: auto;
        box-shadow: -5px 5px 15px 2px rgba(0, 0, 0, 0.14);
        transition: all 0.4s ease;
    }

    .preview-content-container img.preview-active {
        max-width: 98%;
        max-height: 98%;
        top: 1%; // Half of max-height border
        box-shadow: -2px 2px 10px -2px rgba(0, 0, 0, 0.41);
    }

    .preview-half {
        position: relative;
        height: $preview-height;
        width: calc((#{$preview-width}) / 2);
        float: left;
        background: transparent;
        // border-right: 3px solid black;
    }

    /*.preview-container {*/
        /*position: absolute;*/
        /*top: 0;*/
        /*left: 0;*/
    /*}*/
    
    /* COLLECTION IMAGE AND ARTICLE ABSTRACT PREVIEW END */

    .section-container li {
        height: 40px;
    }

    .section-container li:focus {
        outline: none;
    }

    .section-container li a {
        text-align: right;
        font-size: 1.3em;
        display: block;
    }

    .section-container li a:focus {
        outline: none;
    }

    .underlined {
        text-decoration: underline;
    }

    .preview-fade-enter {
        opacity: 0;
    }

    .preview-fade-enter-active {
        transition: opacity 150ms ease-in;
    }

    .preview-fade-enter-to {
        opacity: 1;
    }

    .preview-face-leave {
        opacity: 1;
    }

    .preview-fade-leave-active {
        transition: opacity 150ms ease-out;
    }

    .preview-fade-leave-to {
        opacity: 0;
    }
</style>