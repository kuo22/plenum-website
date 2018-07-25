<template>
    <div>
        <div id="abstract-card-container">
            <h1 id="title">{{article.title}}</h1>
            <h2 id="subtitle">{{article.subtitle}}</h2>
            <h3 id="author">{{article.author.firstName}} {{article.author.lastName}}</h3>

            <h4 id="abstract-title">ABSTRACT</h4>
            <p>{{article.abstract}}</p>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {Article} from '../types/types';

@Component({
    components: {

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

    h1 {
        font-weight: lighter;
    }

    h2 {
        font-weight: lighter;
    }

    h3 {
        font-weight: lighter;
        font-style: italic;
    }

    h4 {
        text-transform: uppercase;
        font-weight: bold;
    }

    p {
        line-height: 1.5em;
        font-size: 1em;
        text-indent: 3em;
        text-align: justify;
    }
</style>