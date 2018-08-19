<template>
    <ul
        role="menu"
        class="fly-out-menu"
        :class="{ 'fly-out-menu--active': menu.active }"
        :style="{background: menu.color}"

        @mouseover="focusedIndex = -1"
    >
        <li
            v-for="(sectionLinks, menuTitle, index) in menu.subMenu"
            :key="index"
            :title="menuTitle + ' Content Menu-bar'"

            class="fly-out-menu__menu-item"
            :aria-labelledby="menuTitle"
        >
            <a
                :v-if="menu.subMenu"
               :id="menu.name + '-fly-out-menu-item-' + index"

               role="menuitem"
               aria-haspopup="true"
               aria-expanded="true"
               :tabindex="index === focusedIndex ? '0' : '-1'"

               @keydown.enter="enterSubmenu(menuTitle)"
               @keydown.space="enterSubmenu(menuTitle)"
               @keydown.right="enterSubmenu(menuTitle)"
               @keydown.left.prevent="closeMainMenuFlyOut(menu, null, true)"
               @keydown.esc.prevent="closeMainMenuFlyOut(menu, null, true)"
               @keydown.up.prevent="moveUp"
               @keydown.down.prevent="moveDown"
               @keydown.home.prevent.native="focusedIndex = 0"
               @keydown.end.prevent.native="focusedIndex = menuItems.length - 1"
               @keydown.alphabet="focusByLetter($event.key, index)"

               v-focus="index === focusedIndex"
               @focus="focusedIndex = index"
            >
                <span
                    class="fly-out-menu__section-title menu-button-content"
                    tabindex="-1"
                >
                    {{ menuTitle }}
                </span>
            </a>
            <main-menu-fly-out-sections
                :menuTitle="menuTitle"
                :menuItems="sectionLinks"
                :parentMenu="menu"
                @activateSubmenuLink="activateSubmenuLink"
                @toggleOpen="toggleOpen"
                @openArticle="openArticle"
                @collectionActivated="collectionActivated"
            >
            </main-menu-fly-out-sections>
        </li>
    </ul>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import {MainMenuItem} from '@/classes/MainMenuItem';
import {SubmenuLink} from '../classes/SubmenuLink';
import ArticlePreview from '@/components/ArticlePreviews';
import MainMenuFlyOutSections from '@/components/MainMenuFlyOutSections';
import { mixin as focusMixin } from 'vue-focus';

@Component({
    mixins: [focusMixin],
    components: {
        ArticlePreview,
        MainMenuFlyOutSections,
    },
})

// Flyout submenu associated with a unique main menu entry
export default class MainMenuFlyOut extends Vue {
    @Prop() private menu!: MainMenuItem; // Parent menu item
    private focusedIndex: number; //
    private collectionsClicked: number; //

    constructor() {
        super();
        this.focusedIndex = -1;
        this.collectionsClicked = 0;
    }

    // Emits an open event to the parent
    @Emit('activateMenu')
    public activateMenu(item: MainMenuItem): void {
        // Filler
    }

    @Emit('toggleOpen')
    public toggleOpen(menu: MainMenuItem): void {
        // Filler
    }

    @Emit('openArticle')
    public openArticle(menu: MainMenuItem, routerLinkLocation: string) {
        // Filler
    }

    @Emit('closeMainMenuFlyOut')
    public closeMainMenuFlyOut(menu: MainMenuItem, wasKeyboardEvent: boolean) {
        // filler
    }

    @Emit('collectionActivated')
    public collectionActivated(submenuLink: SubmenuLink) {
        this.resetAllSubmenuLinksExcept(submenuLink);
    }

    // Moves focus to first submenu item of the menu matching the provided menu title
    // parameter(s):
    //      menuTitle = title of the menu to be entered
    private enterSubmenu(menuTitle: string) {
        document.getElementById(menuTitle.replace(' ', '') + '-section-menu-item-0').focus();
    }

    // Reset submenu links to their initialized state except for the provided submenu link
    // parameter(s) needed:
    //      exception = the submenu link that is NOT reset
    private resetAllSubmenuLinksExcept(exception: SubmenuLink): void {
        const sectionTitles = Object.keys(this.menu.subMenu);
        for (let i = 0; i < sectionTitles.length; i++) {
            const submenuLinks: SubmenuLink[] = this.menu.subMenu[sectionTitles[i]];
            for (let j = 0; j < submenuLinks.length; j++) {
                if (exception.title !== this.menu.subMenu[sectionTitles[i]][j].title) {
                    this.menu.subMenu[sectionTitles[i]][j].active = false;
                    this.menu.subMenu[sectionTitles[i]][j].previewVisible = false;
                    this.menu.subMenu[sectionTitles[i]][j].hidden = true;
                }
            }
        }
    }

    //
    private resetAllSubmenuLinks(): void {
        // Filler
    }

    // TODO: import these functions as mixin? to use in all menu components
    // Move focus down one menu item, or return to first menu item if at the end
    private moveDown() {
        this.focusedIndex = this.focusedIndex === Object.keys(this.menu.subMenu).length - 1 ? 0 : this.focusedIndex + 1;
    }

    // Move focus up one menu item, or return to last menu item if at the first
    private moveUp() {
        this.focusedIndex = this.focusedIndex === 0 ? Object.keys(this.menu.subMenu).length - 1 : this.focusedIndex - 1;
    }

    // Searches through the menu items and moves focus to the next menu item label that starts with the queried letter
    // parameter(s):
    //      queryLetter           = single letter to be queried across menu item labels
    //      currentlyFocusedIndex = index of the menu item that is currently focused
    private focusByLetter(queryLetter: string, currentlyFocusedIndex: number) {
        // If not at the end of the menu...
        if (currentlyFocusedIndex !== Object.keys(this.menu.subMenu).length - 1) {
            for (let i = currentlyFocusedIndex + 1; i < Object.keys(this.menu.subMenu).length; i++) {
                if (Object.keys(this.menu.subMenu)[i].toLowerCase().startsWith(queryLetter)) {
                    document.getElementById(this.menu.name + '-fly-out-menu-item-' + i).focus(); // fly-out-menu-item-1
                }
            }
        }
    }

    // Activates the submenu link and emits an event announcing the submenu's use/ activation
    // parameter(s) needed:
    //      item        = main menu item to which this submenu belongs
    //      sectionName = name of the submenu section of the activated submenu link
    //      submenuLink = the submenu link to be activated
    //      isKeyboardEvent = whether or not the native DOM event was from a key press or not
    private activateSubmenuLink(item: MainMenuItem,
                                sectionName: string,
                                submenuLink: SubmenuLink,
                                isKeyboardEvent: boolean) {
        let activatedFlag: boolean = true;
        // Deactivate all other submenu links, besides the submenu link to be activated
        for (let i = 0; i < this.menu.subMenu[sectionName].length; i++) {
            const menuItem: SubmenuLink = this.menu.subMenu[sectionName][i];
            this.menu.subMenu[sectionName][i].active = (menuItem.title === submenuLink.title) && !submenuLink.active;
            if ((menuItem.title === submenuLink.title) && !submenuLink.active) {
                activatedFlag = false;
            }
        }

        if (activatedFlag) {
            this.activateMenu(item);
            this.resetAllSubmenuLinksExcept(submenuLink);
            submenuLink.active = true;
            if (isKeyboardEvent) {
                // Barely delay to give time for the menu to enter the DOM
                setTimeout(() => {
                    document.getElementById(submenuLink.title.replace(' ', '') + '-entry-0').focus();
                }, 5);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    $viewAllSubMenus: true;
    $lefterWidth: 240px;
    $focusPadding: 10px;

    .fly-out-menu {
        width: 100%;

        font-weight: bold;
        text-align: right;
    }

    .fly-out-menu--active {
        // left: 20px;
        z-index: 4;
    }

    .fly-out-menu__menu-item {
        padding: 15px 15px 0 15px;
    }

    .fly-out-menu__menu-item a {
        display: block;

        text-align: left;
        font-size: 1.6em;
    }

    .fly-out-menu__section-title {
        width: calc(100% - #{$focusPadding});
        padding: 0 0 0 $focusPadding;
    }

    @if $viewAllSubMenus {
        #about, #publications, #contribute, #volunteer {
            display: inline-block !important;
        }

        #about {
            left: $lefterWidth;
        }

        #publications {
            left: 480px;
        }

        #contribute {
            left: 720px;
        }

        #volunteer {
            left: 960px;
        }
    }
</style>