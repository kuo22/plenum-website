<template>
    <div class="article-previews"
         role="presentation"> <!-- TODO: is role necessary? -->
        <div class="preview-content-container"
             v-for="(article, index) in articles"
             v-show="showPreviewManager(article, index)"> <!-- v-show="article.hovered"-->
            <div class="abstract-card-container">
                <article-title-card class="title-card"
                                    v-bind:article="article"></article-title-card>

                <!--hr-->

                <h3 class="abstract-title">ABSTRACT</h3>
                <p class="abstract"
                   :id="parentCollection.title.replace(' ', '') +'preview' + index">{{ article.abstract }}"
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {Article} from '../types/types';
import ArticleTitleCard from '@/components/ArticleTitleCard';
import {SubmenuLink} from '../classes/SubmenuLink';

@Component({
    components: {
        ArticleTitleCard,
    },
})

// Submenu associated with a unique main menu entry
export default class ArticlePreview extends Vue {
    @Prop() private articles: Article[];
    @Prop() private parentCollection: SubmenuLink;
    @Prop() private activeArticleIndex: number;

    constructor() {
        super();
    }

    // When this component is loaded, draw a canvas with an animatable Plenum logo
    public created() {
// filler
    }

    private showPreviewManager(article: Article, index: number): boolean {
        return article.hovered  || (document.getElementById(
            this.parentCollection.title.replace(' ', '') + '-entry-' + index) === document.activeElement
        );
    }
}
</script>

<style lang="scss" scoped>
    h2 {
        text-transform: uppercase;
        font-weight: bold;
        text-align: left;
    }

    p {
        line-height: 1.3em;
        font-size: 1.1em;
        text-indent: 3em;
        text-align: justify;
    }

    p::-webkit-scrollbar {
        width: 2em;
    }

    p::-webkit-scrollbar-track {
        //border: 1px solid black;
        //-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        width: 0.5em;
    }

    p::-webkit-scrollbar-thumb {
        background-color: black;
        border-left: 0.75em solid #fafafa;
        border-right: 0.75em solid #fafafa;
        width: 0.5em;
    }

    /*.article-previews {*/
        /*background: white;*/
    /*}*/

    .preview-container {
        width: 85%;
        margin: auto;
        box-shadow: -5px 5px 15px 2px rgba(0, 0, 0, 0.14);
        background: rgba(250, 250, 250, 0.71);
    }

    .preview-content-container {
        position: absolute;
        top: 5%;
        left: 4%;
        width: 92%;
        height: 90%;
        background: #fafafa;
        box-shadow: 3px 3px 8px 1px #d5d5d5;
        transform: translateY(0vh);
        text-align: center;
    }

    .abstract-card-container {
        position: relative;
        padding: 4em;
        height: calc(100% - 8em);
        text-align: left;
        font-family: "Amiri", serif;
        font-weight: lighter;
        background: rgba(252, 252, 252, 0.5);
    }

    .title-card {

    }

    .abstract {
        height: 68%;
        overflow-x: hidden;
    }

    .abstract-title {
        text-align: center;
        font-size: 1.2em;
        margin-top: 2em;
        margin-bottom: 2em;
        line-height: 1.2em;
    }

    hr {
        margin: 3em;
    }
</style>