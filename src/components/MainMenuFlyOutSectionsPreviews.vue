<template>
    <div
        role="presentation"
        class="collection-preview"
        :class="{'collection-preview--active': sectionMenuItem.expanded }"
    >
        <div class="preview-grid-half">
            <div class="collection-preview__cover-image-frame">
                <img
                    :alt="sectionMenuItem.title + ' Cover Image'"
                    class="collection-preview__cover-image"
                    :class="{ 'collection-preview__cover-image--active': sectionMenuItem.expanded }"
                    :src="baseUrl + sectionMenuItem.cover_image.field_image.url"
                >
            </div>
        </div>

        <div
            class="collection-preview__toc-frame"
            role="presentation"
        >
            <article-previews
                class="preview-grid-half preview-grid-half--previews"
                :articles="sectionMenuItem.articles"
                :parentCollection="sectionMenuItem"
            ></article-previews>
            <div
                role="presentation"
                class="preview-grid-half preview-grid-half--right-half"
            >
                <table-of-contents
                    :parentCollection="sectionMenuItem"
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
    @Prop(Object) private sectionMenuItem!: Object; // The menu item link of the collection this previews shows
    @Prop(Object) private parentMenu!: Object;  // The parent fly out menu of this previews
    private baseUrl: string;

    constructor() {
        super();
        this.baseUrl = process.env.NODE_ENV === "development" ? 'http://localhost:8888' : process.env.VUE_APP_CONTENTA_BASE;
    }

    @Emit('toggleOpen')
    public toggleOpen(mainMenuItem: any): void {}

    @Emit('openArticle')
    public openArticle(): void {}

    @Emit('exitMenu')
    public exitMenu(mainMenuItem: any) {}

}
</script>

<style lang="scss" scoped>
    @import '../styles/_settings';

    // TODO: figure out where this 30px gap between menu elements is coming from
    // CUZ I LIKE IT :)
    $preview-width: calc(100vw - (#{$navBarWidth} * 2) - (30px * 2) - 17px); // Scrollbar width = 17px
    $preview-height: calc(90vh - #{$footerHeight});

    .collection-preview {
        display: inline-block;

        position: fixed;
        left: calc(#{$navBarWidth} * 2 + 30px + 3px); // + outline width
        top: calc((100vh - #{$preview-height}) / 2);
        width: $preview-width;
        height: $preview-height;
        float: right;
        background: white;
        -webkit-box-shadow: -0.2em 0.2em 1em rgba(0, 0, 0, 0.18);
        -moz-box-shadow: -0.2em 0.2em 1em rgba(0, 0, 0, 0.18);
        box-shadow: -0.2em 0.2em 1em rgba(0, 0, 0, 0.18);
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

    // TODO: figure out so there is no stutter bug when preview swaps between collections
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

