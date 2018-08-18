<template>
    <div
        role="presentation"
        class="collection-preview"
        :class="{'collection-active': menuLink.active }"
    >
        <div class="preview-half">
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
                class="preview-half preview-half--previews"
                :articles="menuLink.articles"
                :parentCollection="menuLink"
            ></article-previews>
            <div
                role="presentation"
                class="preview-half preview-half--right-half"
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
import {SubmenuLink} from '../classes/SubmenuLink';
import {MainMenuItem} from '../classes/MainMenuItem';
import TableOfContents from '@/components/TableOfContents';
import ArticleTitleCard from './ArticleTitleCard';
import ArticlePreviews from './ArticlePreviews';

@Component({
        components: {
            ArticlePreviews,
            ArticleTitleCard,
            TableOfContents,
        },
    })

// The main navigation bar for the app, each entry represents a page of wordpress content
    export default class MainMenuFlyOutSectionsPreviews extends Vue {
        @Prop() private menuLink!: SubmenuLink;
        @Prop() private parentMenu!: MainMenuItem;

        constructor() { super(); }

        @Emit('toggleOpen')
        public toggleOpen(menu: MainMenuItem): void { /* Filler */ }

        @Emit('openArticle')
        public openArticle(menu: MainMenuItem, routerLinkLocation: string): void {
            // Filler
        }

        @Emit('exitMenu')
        public exitMenu(parentMenu: SubmenuLink): void {
            // Filler
        }

    }
</script>

<style lang="scss" scoped>
    $lefterWidth: 240px;
    $preview-width: calc(100vw - (#{$lefterWidth} * 2) - 3px);
    $preview-height: 90vh;

    .preview-half {
        position: relative;
        height: $preview-height;
        width: calc((#{$preview-width}) / 2);
        float: left;
        background: transparent;
        // border-right: 3px solid black;
    }

    .preview-half--right-half {
        outline: 3px solid black;
    }

    .preview-half--previews {
        background: white;
        visibility: hidden;
    }

    .toc-preview-container {
        width: $preview-width;
        height: $preview-height;
        position: absolute;
        // background: rgba(255, 255, 255, 0.5);
    }

    .collection-preview.collection-active {
        z-index: 1;
    }

    .collection-preview.hovered {
        z-index: 3;
    }

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
</style>

