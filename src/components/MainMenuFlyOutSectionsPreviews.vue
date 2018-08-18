<template>
    <div
        role="presentation"
        class="collection-preview"
        :class="{'collection-preview--active': menuLink.active }"
    >
        <div class="preview-grid-half">
            <div class="collection-preview__cover-image-frame">
                <img
                    :alt="menuLink.title + ' Cover Image'"
                    class="collection-preview__cover-image"
                    :class="{ 'collection-preview__cover-image--active': menuLink.active }"
                    :src="menuLink.coverImageURL"
                >
            </div>
        </div>

        <div
            class="collection-preview__toc-frame"
            role="presentation"
        >
            <article-previews
                class="preview-grid-half preview-grid-half--previews"
                :articles="menuLink.articles"
                :parentCollection="menuLink"
            ></article-previews>
            <div
                role="presentation"
                class="preview-grid-half preview-grid-half--right-half"
            >
                <table-of-contents
                    :parentCollection="menuLink"
                    :mainMenuAncestor="parentMenu"
                    @toggleOpen="toggleOpen"
                    @articleSelected="openArticle"
                    @exitMenu="exitMenu"
                ></table-of-contents>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import {MainMenuItem} from '../classes/MainMenuItem';
import {SubmenuLink} from '../classes/SubmenuLink';
import ArticlePreviews from '@/components/ArticlePreviews';
import TableOfContents from '@/components/TableOfContents';

@Component({
    components: {
        ArticlePreviews,
        TableOfContents,
    },
})

// The main navigation bar for the app, each entry represents a page of wordpress content
export default class MainMenuFlyOutSectionsPreviews extends Vue {
    @Prop() private menuLink!: SubmenuLink; // The menu item link of the collection this previews shows
    @Prop() private parentMenu!: MainMenuItem; // The parent fly out menu of this previews

    constructor() { super(); }

    @Emit('toggleOpen')
    public toggleOpen(menu: MainMenuItem): void { /* Filler */ }

    @Emit('openArticle')
    public openArticle(menu: MainMenuItem, routerLinkLocation: string): void {
        // Filler
    }

    @Emit('exitMenu')
    public exitMenu(parentMenu: SubmenuLink) {
        // Filler
    }

}
</script>

<style lang="scss" scoped>
    $lefterWidth: 240px;
    $preview-width: calc(100vw - (#{$lefterWidth} * 2) - 3px);
    $preview-height: 90vh;

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

    .preview-grid-half {
        position: relative;
        height: $preview-height;
        width: calc((#{$preview-width}) / 2);
        float: left;

        background: transparent;
    }

    .preview-grid-half--right-half {
        outline: 3px solid black;
    }

    .preview-grid-half--previews {
        visibility: hidden;
        background: white;
    }

    // TODO: figure out so there is no stutter bug when preview swap between collections
    .collection-preview--active {
        z-index: 1;
    }

    .collection-preview__cover-image-frame {
        position: absolute;
        top: 8%;
        left: 4%;
        width: 92%;
        height: 84%;

        text-align: center;
    }

    .collection-preview__cover-image {
        position: relative;
        top: 0;
        height: auto;
        max-width: 100%;
        max-height: 100%;

        box-shadow: -5px 5px 15px 2px rgba(0, 0, 0, 0.14);

        transition: all 0.4s ease;
    }

    .collection-preview__cover-image--active {
        top: 1%; // Half of max-height border
        max-width: 98%;
        max-height: 98%;

        box-shadow: -2px 2px 10px -2px rgba(0, 0, 0, 0.41);
    }

    .collection-preview__toc-frame {
        position: absolute;
        width: $preview-width;
        height: $preview-height;
    }
</style>

