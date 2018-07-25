<template>
    <div>
        <h1 id="title">{{article.title}}</h1>
        <h2 id="subtitle">{{article.subtitle}}</h2>
        <h3 id="author">{{article.author.firstName}} {{article.author.lastName}}</h3>
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
export default class ArticleTitleCard extends Vue {
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

    #title {
        font-weight: lighter;
        line-height: 1em;
    }

    #subtitle {
        font-weight: lighter;
        text-indent: 3em;
        line-height: 1.4em;
    }

    #author {
        font-weight: lighter;
        font-style: italic;
        margin-top: 3px;
    }


</style>