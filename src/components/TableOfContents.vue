<template>
    <div role="presentation" class="table-of-contents">
        <ul class="preview-index index"
            role="menu"
            :title="parentCollection.title + ' Content Menu'"
            :aria-label="parentCollection.title + ' Content Menu'">
            <li v-for="(article, index) in parentCollection.articles"
                class="preview-index-entry menu-button"
                role="none">
                <router-link :to="'/articles/' + article.nodeNumber"
                             :id="parentCollection.title.replace(' ', '') + '-entry-' + index"
                             :tabindex="index === 0 || index === focusedIndex ? '0' : '-1'"

                             role="menuitem"

                             @mouseover.native="toggleLingerHover(index)"

                             @click.native="articleSelected(mainMenuAncestor, '/articles/' + article.nodeNumber); article.hovered = false;"
                             @keydown.right.native="articleSelected(mainMenuAncestor, '/articles/' + article.nodeNumber); article.hovered = false;"
                             @keydown.enter.native="articleSelected(mainMenuAncestor, '/articles/' + article.nodeNumber); article.hovered = false;"
                             @keydown.space.native="articleSelected(mainMenuAncestor, '/articles/' + article.nodeNumber); article.hovered = false;"
                             @keydown.esc.prevent.native="exitMenu(parentCollection)"
                             @keydown.left.prevent.native="exitMenu(parentCollection)"
                             @keydown.down.prevent.native="moveDown"
                             @keydown.up.prevent.native="moveUp"
                             @keydown.home.prevent.native="focusedIndex = 0"
                             @keydown.end.prevent.native="focusedIndex = parentCollection.articles.length - 1"
                             @keydown.alphabet.native="focusByLetter($event.key, index)"

                             v-focus="index === focusedIndex"
                             @focus.native="focusedIndex = index; article.hovered = true;"
                             @blur.native="article.hovered = false">
                    <p class="title menu-button-content" tabindex="-1">{{ article.title }}</p>
                    <p class="author">{{ article.author.firstName }} {{ article.author.lastName }}</p>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import {MainMenuItem} from '../classes/MainMenuItem';
import { mixin as focusMixin } from 'vue-focus';
import {SubmenuLink} from '../classes/SubmenuLink';
import {Article} from '../types/types';

@Component({
    mixins: [focusMixin],
    components: {},
})

// Submenu associated with a unique main menu entry
export default class TableOfContents extends Vue {
    @Prop() private parentCollection!: SubmenuLink;
    @Prop() private mainMenuAncestor: MainMenuItem;
    @Prop() private focusedIndex: number;
    private scrollPosition: number;

    constructor() {
        super();
        this.scrollPosition = 0;
    }

    @Emit('toggleOpen')
    public toggleOpen(menu: MainMenuItem): void {
        // Filler
    }

    @Emit('articleSelected')
    public articleSelected(menu: MainMenuItem, routerLinkLocation: string) {
        // Filler
    }

    @Emit('exitMenu')
    public exitMenu(parentMenu: SubmenuLink): void {
        // Filler
    }

    private deactivateAllHovers(): void {
        for (let i = 0; i < this.parentCollection.articles.length; i++) {
            this.parentCollection.articles[i].hovered = false;
        }
    }

    private toggleLingerHover(index: number): void {
        for (let i = 0; i < this.parentCollection.articles.length; i++) {
            if (i !== index) {
                this.parentCollection.articles[i].hovered = false;
            } else {
                this.parentCollection.articles[index].hovered = true;
            }
        }
    }

    private focusArticle(article: Article, index: number): void {
        this.focusedIndex = index;
        article.hovered = true;
    }

    // Searches through the menu items and moves focus to the next menu item label that starts with the queried letter
    // parameter(s):
    //      queryLetter           = single letter to be queried across menu item labels
    //      currentlyFocusedIndex = index of the menu item that is currently focused
    private focusByLetter(queryLetter: string, currentlyFocusedIndex: number) {
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

    // TODO: import these functions as mixin? to use in all menu components
    private moveDown() {
        this.focusedIndex = this.focusedIndex === this.parentCollection.articles.length - 1 ? 0 : this.focusedIndex + 1;
    }

    private moveUp() {
        this.focusedIndex = this.focusedIndex === 0 ? this.parentCollection.articles.length - 1 : this.focusedIndex - 1;
    }
}
</script>

<style lang="scss" scoped>
    $viewAllSubMenus: false;
    $lefterWidth: 240px;
    $preview-container: calc(100vw - #{$lefterWidth});

    a {
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    .table-of-contents {
        outline: 3px solid black;
    }

    /* index-card-component */
    .preview-index {
        position: relative;
        text-align: left;
        top: 8%;
        width: 92%;
        height: 84%;
        margin: auto;
    }

    .preview-index-entry {
        width: 100%;
        height: auto;
        margin-bottom: 1em;
    }

    .title, .author {
        font-family: 'Amiri', serif;
        font-weight: lighter;
    }

    .title {
        font-size: 2.1em;
        line-height: 1em;
        padding: 10px;
    }

    .author {
        font-style: italic;
        font-size: 1.4em;
        line-height: 1.4em;
        text-align: right;
    }
    /* index-card-component */

    .visible {
        opacity: 1;
    }

    .abstract .cover-content-container {
        opacity: 0;
        transition: opacity 0.3s ease;
        background: rgba(255, 255, 255, 0.9);
    }

    .abstract .cover-content-container.visible {
        opacity: 1;
    }

    .component-fade-enter-active {
        transition: opacity 0.1s ease;
    }

    .component-fade-leave-active {
        transition: opacity 0.3s ease;
    }
</style>