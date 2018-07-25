<template>
    <div id="preview-container">
        <div id="abstract-card-container">
            <article-title-card id="title-card" v-bind:article="article"></article-title-card>

            <hr>

            <h4 id="abstract-title">ABSTRACT</h4>
            <p id="abstract">{{ article.abstract }}</p>
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
    #preview-container {
        width: 85%;
        margin: auto;
        box-shadow: -5px 5px 15px 2px rgba(0, 0, 0, 0.14);
        background: rgba(250, 250, 250, 0.71);
    }

    #abstract-card-container {
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
        line-height: 1.3em;
        font-size: 1em;
        text-indent: 3em;
        text-align: justify;
    }

    #abstract-title {
        text-align: center;
        font-size: 1.2em;
        margin-bottom: 2em;
        line-height: 1.2em;
    }

    #title-card {
    }

    hr {
        margin: 3em;
    }
</style>