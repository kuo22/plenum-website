<template>
    <ul
        role="menu"
        class="fly-out-menu"
        :class="{ 'fly-out-menu--active': menu.expanded }"
        :style="{background: menu.color}"

        @mouseover="focusedIndex = -1"
    >
        <slot v-if="menu.hasSections">
            <li
                v-for="(section, index) in menu.submenu"
                :key="index"
                :title="section.title + ' Content Menu Bar'"

                class="fly-out-menu__menu-item"
                :aria-labelledby="section.title"
            >
                <a
                    :v-if="menu.submenu"
                   :id="menu.title + '-fly-out-menu-item-' + index"

                   role="menuitem"
                   aria-haspopup="true"
                   aria-expanded="true"
                   :tabindex="index === focusedIndex ? '0' : '-1'"

                   @keydown.enter="enterSubmenu(section.title)"
                   @keydown.space="enterSubmenu(section.title)"
                   @keydown.right="enterSubmenu(section.title)"
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
                        {{ section.title }}
                    </span>
                </a>
                <main-menu-fly-out-sections
                    :menuTitle="section.title"
                    :menuItems="section.submenu"
                    :parentMenu="menu"
                    @handleSubmenuLinkActivation="handleSubmenuLinkActivation"
                    @toggleOpen="toggleOpen"
                    @openArticle="openArticle"
                    @collectionActivated="collectionActivated"
                >
                </main-menu-fly-out-sections>
            </li>
        </slot>
        <slot v-else>
            <li
                :title="menu.title + ' Content Menu Bar'"

                class="fly-out-menu__menu-item"
                :aria-labelledby="menu.title"
            >
                <a>
                    <span
                        class="fly-out-menu__section-title menu-button-content"
                        tabindex="-1"
                    >
                        {{ menu.title }}
                    </span>
                </a>
                <main-menu-fly-out-sections
                        :menuTitle="menu.title"
                        :menuItems="menu.submenu"
                        :parentMenu="menu"
                        @toggleOpen="toggleOpen"
                        @openArticle="openArticle"
                        @collectionActivated="collectionActivated"
                >
                </main-menu-fly-out-sections>
            </li>
        </slot>
    </ul>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import ArticlePreview from '@/components/ArticlePreviews';
import MainMenuFlyOutSections from '@/components/MainMenuFlyOutSections';
import { mixin as focusMixin } from 'vue-focus';
import { mapActions } from 'vuex';

@Component({
    mixins: [focusMixin],
    components: {
        ArticlePreview,
        MainMenuFlyOutSections,
    }
})

// Flyout submenu associated with a unique main menu entry
export default class MainMenuFlyOut extends Vue {
    @Prop() private menu!: Object; // Parent menu item
    private focusedIndex: number; //
    private collectionsClicked: number; //

    constructor() {
        super();
        this.focusedIndex = -1;
        this.collectionsClicked = 0;
    }

    // Emits an open event to the parent
    @Emit('activateMenu')
    public activateMenu(mainMenuItem: any): void {
        // Filler
    }

    @Emit('toggleOpen')
    public toggleOpen(mainMenuItem: any): void {
        // Filler
    }

    @Emit('openArticle')
    public openArticle() {
        // Filler
    }

    @Emit('closeMainMenuFlyOut')
    public closeMainMenuFlyOut(mainMenuItem: any, wasKeyboardEvent: boolean) {
        // filler
    }

    @Emit('collectionActivated')
    public collectionActivated(submenuLink: {expanded}) {
        if (submenuLink.expanded) {
            this.$store.dispatch('menuTree/deactivateAllPreviews');
        } else {
            this.$store.dispatch('menuTree/activateSubmenuPreview', submenuLink);
        }
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
    // TODO: move to store action
    private resetAllSubmenuLinksExcept(exception: {uuid}): void {
        let submenu = [...this.menu.submenu];
        submenu.forEach(section => {
            section.submenu.forEach(menuItem => { // Most likely an article collection
                if (exception.uuid !== menuItem.uuid) {
                    menuItem.expanded = false;
                    menuItem.previewVisible = false;
                } else {
                    menuItem.expanded = true;
                    menuItem.previewVisible = true;
                }
            })
        });

        const sectionTitles = Object.keys(this.menu.submenu);
        for (let i = 0; i < sectionTitles.length; i++) {
            const submenuLinks: Array<Object> = this.menu.submenu[sectionTitles[i]];
            for (let j = 0; j < submenuLinks.length; j++) {
                if (exception.title !== this.menu.submenu[sectionTitles[i]][j].title) {
                    this.menu.submenu[sectionTitles[i]][j].expanded = false;
                    this.menu.submenu[sectionTitles[i]][j].previewVisible = false;
                    // this.menu.submenu[sectionTitles[i]][j].hidden = true;
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
        this.focusedIndex = this.focusedIndex === Object.keys(this.menu.submenu).length - 1 ? 0 : this.focusedIndex + 1;
    }

    // Move focus up one menu item, or return to last menu item if at the first
    private moveUp() {
        this.focusedIndex = this.focusedIndex === 0 ? Object.keys(this.menu.submenu).length - 1 : this.focusedIndex - 1;
    }

    // Searches through the menu items and moves focus to the next menu item label that starts with the queried letter
    // parameter(s):
    //      queryLetter           = single letter to be queried across menu item labels
    //      currentlyFocusedIndex = index of the menu item that is currently focused
    private focusByLetter(queryLetter: string, currentlyFocusedIndex: number) {
        // If not at the end of the menu...
        if (currentlyFocusedIndex !== Object.keys(this.menu.submenu).length - 1) {
            for (let i = currentlyFocusedIndex + 1; i < Object.keys(this.menu.submenu).length; i++) {
                if (Object.keys(this.menu.submenu)[i].toLowerCase().startsWith(queryLetter)) {
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
    private handleSubmenuLinkActivation(mainMenuItem: any,
                                sectionName: string,
                                submenuLink: SubmenuLink,
                                isKeyboardEvent: boolean) {
        let activatedFlag: boolean = true;
        // Deactivate all other submenu links, besides the submenu link to be activated
        for (let i = 0; i < this.menu.submenu[sectionName].length; i++) {
            const menuItem: SubmenuLink = this.menu.submenu[sectionName][i];
            this.menu.submenu[sectionName][i].expanded = (menuItem.title === submenuLink.title) && !submenuLink.expanded;
            if ((menuItem.title === submenuLink.title) && !submenuLink.expanded) {
                activatedFlag = false;
            }
        }

        if (activatedFlag) {
            this.activateMenu(mainMenuItem);
            this.resetAllSubmenuLinksExcept(submenuLink);
            submenuLink.expanded = true;
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