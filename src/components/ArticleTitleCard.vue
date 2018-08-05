<template>
    <div>
        <h1 class="title">{{article.title}}</h1>
        <span v-if="article.subtitle" class="subtitle">{{article.subtitle}}</span>
        <p title="author " class="author">{{article.author.firstName}} {{article.author.lastName}}</p>
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
    .title {
        font-weight: lighter;
        line-height: 1em;
    }

    .subtitle {
        font-weight: lighter;
        text-indent: 3em;
        line-height: 1.4em;
    }

    .author {
        font-weight: lighter;
        font-style: italic;
        margin-top: 3px;
    }


</style>