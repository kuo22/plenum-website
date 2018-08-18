<template>
        <ul
            class="table-of-contents"
            role="menu"
            :title="parentCollection.title + ' Content Menu'"
            :aria-label="parentCollection.title + ' Content Menu'"
            @mouseover="focusedIndex = -1"
        >
            <li
                v-for="(article, index) in parentCollection.articles"
                :key="index"
                class="menu-button"
                role="none"
            >
                <router-link
                    :to="'/articles/' + article.nodeNumber"
                    :id="parentCollection.title.replace(' ', '') + '-entry-' + index"

                    class="table-of-contents__menu-item"
                    :class="{
                                'table-of-contents__menu-item--hovered': article.previewVisible,
                                'table-of-contents__menu-item--focused': focusedIndex !== -1
                            }"

                    role="menuitem"
                    :tabindex="index === focusedIndex ? '0' : '-1'"

                    v-focus="index === focusedIndex"

                    @mouseover.native="radioTogglePreviewVisibleState(index)"

                    @click.prevent.native="articleSelected(mainMenuAncestor, '/articles/' + article.nodeNumber); article.previewVisible = false;"
                    @keydown.rightprevent.native="articleSelected(mainMenuAncestor, '/articles/' + article.nodeNumber); article.previewVisible = false;"
                    @keydown.enter.prevent.native="articleSelected(mainMenuAncestor, '/articles/' + article.nodeNumber); article.previewVisible = false;"
                    @keydown.space.prevent.native="articleSelected(mainMenuAncestor, '/articles/' + article.nodeNumber); article.previewVisible = false;"
                    @keydown.esc.prevent.native="exitMenu(parentCollection)"
                    @keydown.left.prevent.native="exitMenu(parentCollection)"
                    @keydown.down.prevent.native="moveFocusDownMenu"
                    @keydown.up.prevent.native="moveFocusUpMenu"
                    @keydown.home.prevent.native="focusedIndex = 0"
                    @keydown.end.prevent.native="focusedIndex = parentCollection.articles.length - 1"
                    @keydown.alphabet.native="focusByLetter($event.key, index)"

                    @focus.native="focusedIndex = index; article.previewVisible = true;"
                    @blur.native="article.previewVisible = false"
                >
                    <p
                        class="table-of-contents__title menu-button-content"
                        tabindex="-1"
                    >
                        {{ article.title }}
                    </p>
                    <p class="table-of-contents__author">{{ article.author.firstName }} {{ article.author.lastName }}</p>
                </router-link>
            </li>
        </ul>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import { mixin as focusMixin } from 'vue-focus';
import {MainMenuItem} from '../classes/MainMenuItem';
import {SubmenuLink} from '../classes/SubmenuLink';

@Component({
    mixins: [focusMixin],
    components: {},
})

// Submenu associated with a unique main menu entry
export default class TableOfContents extends Vue {
    @Prop() private parentCollection!: SubmenuLink; //
    @Prop() private mainMenuAncestor!: MainMenuItem; //
    private focusedIndex: number; //
    private scrollPosition: number; //

    // Construct the Table of Contents Vue component and initialize component data
    constructor() {
        super();
        this.scrollPosition = 0;
        this.focusedIndex = -1;
    }

    @Emit('articleSelected')
    public articleSelected(menu: MainMenuItem, routerLinkLocation: string): void {
        this.resetFocus();
    }

    @Emit('exitMenu')
    public exitMenu(parentMenu: SubmenuLink): void {
        // Filler
    }

    // Radio toggles the visibility of the article preview amongst all articles of a collection
    // except for the article menu item with the provided index
    private radioTogglePreviewVisibleState(visibleMenuItemIndex: number): void {
        for (let i = 0; i < this.parentCollection.articles.length; i++) {
            if (i !== visibleMenuItemIndex) {
                this.parentCollection.articles[i].previewVisible = false;
            } else {
                this.parentCollection.articles[visibleMenuItemIndex].previewVisible = true;
            }
        }
    }

    // Resets the focus so no menu item is in focus
    // TODO: make this global for menu components?
    private resetFocus(): void {
        this.focusedIndex = -1;
    }

    // Searches through the menu items and moves focus to the next menu item label that starts with the queried letter
    // parameter(s):
    //      queryLetter           = single letter to be queried across menu item labels
    //      currentlyFocusedIndex = index of the menu item that is currently focused
    private focusByLetter(queryLetter: string, currentlyFocusedIndex: number): void {
        // If not at the end of the menu...
        const lengthOfMenu: number = this.parentCollection.articles.length;
        if (currentlyFocusedIndex !== lengthOfMenu - 1) {
            for (let index = currentlyFocusedIndex + 1; index < lengthOfMenu; index++) {
                if (this.parentCollection.articles[index].title.toLowerCase().startsWith(queryLetter)) {
                    document.getElementById(
                        // fly-out-menu-item-1
                        this.parentCollection.title.replace(' ', '') + '-entry-' + index).focus();
                }
            }
        }
    }

    // Move focus down one menu item, or return to first menu item if at the end
    private moveFocusDownMenu(): void {
        this.focusedIndex = this.focusedIndex === this.parentCollection.articles.length - 1 ? 0 : this.focusedIndex + 1;
    }

    // Move focus up one menu item, or return to last menu item if at the first
    private moveFocusUpMenu(): void {
        this.focusedIndex = this.focusedIndex === 0 ? this.parentCollection.articles.length - 1 : this.focusedIndex - 1;
    }
}
</script>

<style lang="scss" scoped>
    .table-of-contents {
        position: relative;
        top: 8%;
        width: 92%;
        height: 84%;
        margin: auto;

        text-align: left;
    }

    .table-of-contents__menu-item {
        width: 100%;
        height: auto;
        padding-bottom: 1em;

        border-left: 3px solid transparent;

        font-family: 'Amiri', serif;
        font-weight: lighter;
    }

    .table-of-contents__menu-item--hovered {
        border-left: 3px solid black;
    }

    .table-of-contents__menu-item--focused {
        border-left: 3px solid transparent;
    }

    .table-of-contents__title {
        padding: 10px;

        font-size: 2.1em;
        line-height: 1em;
    }

    .table-of-contents__author {
        text-align: right;
        font-style: italic;
        font-size: 1.4em;
        line-height: 1.4em;
    }
</style>