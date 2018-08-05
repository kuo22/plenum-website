<template>
    <div class="preview-container">
        <div class="abstract-card-container">
            <article-title-card class="title-card" v-bind:article="article"></article-title-card>

            <hr>

            <h2 class="abstract-title">ABSTRACT</h2>
            <p class="abstract">{{ article.abstract }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {Article} from '../types/types';
import ArticleTitleCard from '@/components/ArticleTitleCard';

@Component({
    components: {
        ArticleTitleCard,
    },
})

// Submenu associated with a unique main menu entry
export default class ArticlePreview extends Vue {
    @Prop() private article: Article;

    constructor() {
        super();
    }

    // When this component is loaded, draw a canvas with an animatable Plenum logo
    public created() {
// filler
    }
}
</script>

<style lang="scss" scoped>
    .preview-container {
        width: 85%;
        margin: auto;
        box-shadow: -5px 5px 15px 2px rgba(0, 0, 0, 0.14);
        background: rgba(250, 250, 250, 0.71);
    }

    .abstract-card-container {
        position: relative;
        width: 80%;
        height: 90%;
        left: 10%;
        top: 5%;
        text-align: left;
        font-family: "Amiri", serif;
        font-weight: lighter;
        background: rgba(252, 252, 252, 0.5);
    }

    h4 {
        text-transform: uppercase;
        font-weight: bold;
    }

    p {
        line-height: 1.4em;
        font-size: 1.2em;
        text-indent: 3em;
        text-align: justify;
    }

    .title-card {

    }

    .abstract {
        height: 66%;
        overflow: hidden;
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