<template>
    <div>
        <div
            v-for="(article, index) in articles.filter(article => article.abstract)"
            v-show="isArticlePreviewVisible(article, index)"
            :key="index"
            class="article-preview-card"
            :class="{ 'article-preview-card--visible': isAnyArticlePreviewActive}"
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

@Component({
    components: {
        ArticlePreviewsTitleCard,
    },
})

// A stack of previews of a provided list of articles that individually presents
// the articles' title, subtitle and abstract. Only articles that contain abstracts are potentially rendered.
export default class ArticlePreviews extends Vue {
    @Prop({ type: Array, default: () => []}) private articles!: Array<any>;
    @Prop(Object) private parentCollection!: any;

    constructor() { super(); }

    // Computed: Returns whether or not any article's preview is visible
    get isAnyArticlePreviewActive() {
        return this.articles.some((article: any, index) => {
            // Uncomment to reimplement abstract visibility upon keyboard navigational focus
            //let articleId = this.parentCollection.title.replace(' ', '') + '-entry-' + index;
            //return article.abstract && (article.previewVisible || document.activeElement === document.getElementById(articleId));
            return article.abstract && article.previewVisible;
        });
    }

    // Returns whether or not the article should be visible
    // parameter(s) needed:
    //      article = the article that might be visible
    //      index   = the index of the same article in the table of contents
    private isArticlePreviewVisible(article: any, index: number): boolean {
        return article.previewVisible || (document.getElementById(
            this.parentCollection.title.replace(' ', '') + '-entry-' + index) === document.activeElement
        );
    }
}
</script>

<style lang="scss" scoped>
    .article-preview-card--visible {
        visibility: visible !important;
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
        margin-top: 1.2em;
        margin-bottom: 1em;

        font-size: 2em;
        line-height: 2em;
        text-align: center;
    }

    .article-preview-card__abstract {
        height: 68%; // TODO: use flex box to automatically fill rest of
        overflow-x: hidden;

        text-indent: 3em;
        font-size: 1.7em;
        line-height: 1.5em;
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