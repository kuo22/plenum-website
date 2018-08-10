<template>
    <ul :aria-labelledby="menuTitle"
        class="submenu-section-menu"
        role="menu">
        <li class="menu-button"
            role="none"
            v-for="(menuLink, index) in menuItems"
            v-on:mouseover="menuLink.hovered = true"
            v-on:mouseleave="menuLink.hovered = false">
            <router-link :to="'/' + parentMenu.name.toLowerCase() +
                              '/' + menuLink.title.replace(new RegExp(' ', 'g'), '-').toLowerCase() +
                              '/index'"
                         :id="index === 0 ? menuTitle.toString().replace(' ','-') + '-first' : null"
                         :class="{ underlined: menuLink.active }"
                         :tabindex="index === 0 || index === focusedIndex ? '0' : '-1'"
                         role="menuitem"
                         aria-haspopup="true"
                         :aria-expanded="menuLink.active ? 'true' : 'false'"

                         @click.native="activateSubmenuLink(parentMenu, menuTitle, menuLink, false)"
                         @keydown.enter.prevent.native="activateSubmenuLink(parentMenu, menuTitle, menuLink, true)"
                         @keydown.right.prevent.native="activateSubmenuLink(parentMenu, menuTitle, menuLink, true)"
                         @keydown.space.prevent.native="activateSubmenuLink(parentMenu, menuTitle, menuLink, true)"
                         @keydown.left.prevent.native="exitMenu(menuTitle)"
                         @keydown.down.prevent.native="moveDown"
                         @keydown.up.prevent.native="moveUp"
                         @keydown.home.prevent.native="focusedIndex = 0"
                         @keydown.end.prevent.native="focusedIndex = menuItems.length - 1"

                         v-focus="index === focusedIndex"
                         @focus.native="focusedIndex = index; menuLink.hovered = true;"
                         @blur.native="menuLink.hovered = false;">
                <span class="menu-button-content" tabindex="-1">{{ menuLink.title }}&nbsp;</span>
            </router-link>
            <submenu-item-preview
                    v-bind:menu="parentMenu"
                    v-on:toggleOpen="toggleOpen"
                    v-on:articleSelected="openArticle">
            </submenu-item-preview>
        </li>
    </ul>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import {MainMenuItem} from '@/classes/MainMenuItem';
import {SubmenuLink} from '../classes/SubmenuLink';
import { mixin as focusMixin } from 'vue-focus';
import SubmenuItemPreview from '@/components/SubmenuItemPreview';

@Component({
    mixins: [focusMixin],
    components: {
        SubmenuItemPreview,
    },
})

// Submenu associated with a unique main menu entry
export default class SubmenuSectionMenu extends Vue {
    @Prop() private menuItems!: SubmenuLink[]; // Parent sectionMenu item
    @Prop() private menuTitle!: string;
    @Prop() private parentMenu: MainMenuItem;
    @Prop() private focusedIndex!: number;
    @Prop() private menuItemHovered: boolean;
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
    $preview-container: calc(100vw - #{$lefterWidth});
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

    .preview-half {
        position: relative;
        display: inline-block;
        height: 100vh;
        width: calc((#{$preview-container} - #{$lefterWidth}) / 2);
        float: left;
        background: white;
    }

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
</style>