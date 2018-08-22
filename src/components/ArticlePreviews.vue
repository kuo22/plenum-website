<template>
    <div
        :class="{ 'article-previews--visible': isAnyArticlePreviewActive}"
    >
        <!-- TODO: move above :class declaration to parent -->
        <div
            v-for="(article, index) in articles"
            v-show="isArticlePreviewVisibe(article, index)"
            :key="index"
            class="article-preview-card"
        >
            <div class="article-preview-card__paper">
                <article-previews-title-card :article="article"></article-previews-title-card>

                <h3 class="article-preview-card__abstract-title">ABSTRACT</h3>
                <p
                    :id="parentCollection.title.replace(' ', '') +'preview' + index"
                    class="article-preview-card__abstract"
                >
                    {{ article.abstract }}
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import ArticlePreviewsTitleCard from '@/components/ArticlePreviewsTitleCard';
import {SubmenuLink} from '../classes/SubmenuLink';
import {Article} from '../types/types';

@Component({
    components: {
        ArticlePreviewsTitleCard,
    },
})

// Submenu associated with a unique main menu entry
export default class ArticlePreviews extends Vue {
    @Prop({ type: Array < Article > [] })
    private articles!: Article[];

    @Prop({ type: SubmenuLink })
    private parentCollection!: SubmenuLink;

    constructor() { super(); }

    // Computed: Returns whether or not any article's preview is visible
    get isAnyArticlePreviewActive() {
        let articleActiveFlag: boolean = false;
        for (let i = 0; i < this.articles.length; i++) {
            if (this.articles[i].previewVisible || (document.getElementById(
                    this.parentCollection.title.replace(' ', '') + '-entry-' + i) === document.activeElement)) {
                articleActiveFlag = true;
            }
        }

        return articleActiveFlag;
    }

    // Returns whether or not the article should be visible
    // parameter(s) needed:
    //      article = the article that might be visible
    //      index   = the index of the same article in the table of contents
    private isArticlePreviewVisibe(article: Article, index: number): boolean {
        return article.previewVisible || (document.getElementById(
            this.parentCollection.title.replace(' ', '') + '-entry-' + index) === document.activeElement
        );
    }
}
</script>

<style lang="scss" scoped>
    .article-previews--visible {
        visibility: visible;
    }

    .article-preview-card {
        position: absolute;
        top: 5%;
        left: 4%;
        width: 92%;
        height: 90%;

        box-shadow: 3px 3px 8px 1px #d5d5d5;

        background: #fafafa;

        text-align: center;
    }

    .article-preview-card__paper {
        position: relative;
        height: calc(100% - 8em);
        padding: 4em;

        background: rgba(252, 252, 252, 0.5);

        text-align: left;
        font-family: "Amiri", serif;
        font-weight: lighter;
    }

    .article-preview-card__abstract-title {
        margin-top: 2em;
        margin-bottom: 2em;

        font-size: 1.2em;
        line-height: 1.2em;
        text-align: center;
    }

    .article-preview-card__abstract {
        height: 68%;
        overflow-x: hidden;

        text-indent: 3em;
        font-size: 1.1em;
        line-height: 1.3em;
        text-align: justify;
    }

    .article-preview-card__abstract::-webkit-scrollbar {
        width: 2em;
    }

    .article-preview-card__abstract::-webkit-scrollbar-track {
        width: 0.5em;
    }

    .article-preview-card__abstract::-webkit-scrollbar-thumb {
        width: 0.5em;

        border-left: 0.75em solid #fafafa;
        border-right: 0.75em solid #fafafa;

        background-color: black;
    }
</style>