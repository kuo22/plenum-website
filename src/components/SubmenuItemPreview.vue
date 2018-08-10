<template>
    <ul class="submenu-item-preview">
        <template v-for="sectionLinks in menu.subMenu">
            <transition v-for="submenuLink in sectionLinks" name="component-fade">
                <div v-if="submenuLink.hovered || submenuLink.active" id="submenu-preview-container"
                     :class="{ 'submenu-link-active': submenuLink.active, hovered: submenuLink.hovered }">
                    <div id="cover" class="preview-half preview-container">
                        <div class="cover-content-container">
                            <img :alt="submenuLink.title + ' Cover Image'" :class="{ 'preview-active': submenuLink.active }" :src="submenuLink.coverImageURL">
                        </div>

                    </div>
                    <div id="article-preview-container" class="preview-container">
                        <div class="abstract preview-half" style="background: transparent">
                            <div class="cover-content-container"
                                 v-for="(article, articleID) in submenuLink.articles"
                                 :class="{ visible: article.hovered }">
                                <article-preview class="article-preview"
                                                 v-bind:article="article">
                                </article-preview>
                            </div>
                        </div>
                        <nav id="index"
                             class="preview-half"
                             role="navigation"
                             :aria-label="submenuLink.title + ' Content Menu'">
                            <ul id="preview-index"
                                :title="submenuLink.title + ' Content Menu'"
                                role="menu"
                                :aria-label="submenuLink.title + ' Content Menu'">
                                <li v-for="(article, index) in submenuLink.articles" class="preview-index-entry menu-button">
                                    <!-- TODO: make seperate nav component for each article list -->
                                    <!-- TODO: create and use a closeMenu(menu: MainMenuItem, router-link url?: string) -->
                                    <router-link :to="'/articles/' + article.nodeNumber"
                                                 :id="index === 0 ? 'first-' + submenuLink.title.replace(' ', '-') : null"
                                                 :tabindex="index === 0 || index === focused ? '0' : '-1'"
                                                 role="menuitem"
                                                 @click.native="articleSelected(menu, '/articles/' + article.nodeNumber); article.hovered = false;"
                                                 @keydown.right.native="articleSelected(menu, '/articles/' + article.nodeNumber); article.hovered = false;"
                                                 @keydown.enter.native="articleSelected(menu, '/articles/' + article.nodeNumber); article.hovered = false;"
                                                 @mouseover.native="article.hovered = true"
                                                 @mouseleave.native="article.hovered = false"
                                                 @keydown.down.prevent.native="moveDown"
                                                 @keydown.up.prevent.native="moveUp"
                                                 v-focus="index === focused"
                                                 @focus.native="focused = index; article.hovered = true;"
                                                 @blur.native="focused = null; article.hovered = false;">
                                        <p class="title menu-button-content" tabindex="-1">{{ article.title }}</p>
                                        <p class="author">{{ article.author.firstName }} {{ article.author.lastName }}</p>
                                    </router-link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </transition>
        </template>
    </ul>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import {MainMenuItem} from '../classes/MainMenuItem';
import ArticlePreview from '@/components/ArticlePreview';
import { mixin as focusMixin } from 'vue-focus';

@Component({
    mixins: [focusMixin],
    components: {
        ArticlePreview,
    },
})

// Submenu associated with a unique main menu entry
export default class SubmenuItemPreview extends Vue {
    @Prop() private menu: MainMenuItem;
    @Prop() private focused: number;

    constructor() {
        super();
    }

    @Emit('toggleOpen')
    public toggleOpen(menu: MainMenuItem): void {
        // Filler
    }

    @Emit('articleSelected')
    public articleSelected(menu: MainMenuItem, routerLinkLocation: string) {
        // Filler
    }

    // TODO: import these functions as mixin? to use in all menu components
    private moveDown() {
        this.focused = this.focused === this.menuItems.length - 1 ? 0 : this.focused + 1;
    }

    private moveUp() {
        this.focused = this.focused === 0 ? this.menuItems.length - 1 : this.focused - 1;
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

    .cover-content-container {
        position: absolute;
        top: 8%;
        left: 4%;
        width: 92%;
        height: 84%;
        background: transparent;
        transform: translateY(0vh);
        text-align: center;
    }

    .cover-content-container .article-preview {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .cover-content-container img {
        position: relative;
        max-width: 100%;
        max-height: 100%;
        top: 0;
        height: auto;
        box-shadow: -5px 5px 15px 2px rgba(0, 0, 0, 0.14);
        transition: all 0.4s ease;
    }

    .cover-content-container img.preview-active {
        max-width: 98%;
        max-height: 98%;
        top: 1%; // Half of max-height border
        box-shadow: -2px 2px 10px -2px rgba(0, 0, 0, 0.41);
    }

    .preview-container {
        position: absolute;
        top: 0;
        left: 0;
    }

    #index {
        outline: 3px solid black;
    }

    .preview-half {
        position: relative;
        display: inline-block;
        height: 100vh;
        width: calc((#{$preview-container} - #{$lefterWidth}) / 2);
        float: left;
        background: white;
    }

    #submenu-preview-container {
        display: inline-block;
        position: absolute;
        left: $lefterWidth;
        top: 0;
        width: $preview-container;
        height: 100vh;
        float: right;
        background: white;
        z-index: 2;
    }

    #submenu-preview-container.submenu-link-active {
        display: inline-block;
        width: $preview-container;
        height: 100vh;
        float: right;
        z-index: 1;
    }

    #submenu-preview-container.hovered {
        z-index: 3;
    }

    /* index-card-component */
    #preview-index {
        width: 90%;
        height: 82vh;
        max-width: 90%;
        max-height: 82vh;
        transform: translateY(9vh);
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
        font-size: 2.5em;
        text-align: left;
        line-height: 1em;
        padding: 10px;
    }

    .author {
        font-style: italic;
        font-size: 1.5em;
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

    #cover {
        border-right: 3px solid black;
        background: transparent;
    }

    .component-fade-enter-active {
        transition: opacity 0.1s ease;
    }

    .component-fade-leave-active {
        transition: opacity 0.3s ease;
    }

    .component-fade-enter-to,
    .component-fade-leave {
        opacity: 1;
    }

    .component-fade-leave-to,
    .component-fade-enter {
        opacity: 0;
    }
</style>