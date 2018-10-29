<template>
    <div>
        <h1 class="title">{{article.title}}</h1>
        <div
            v-if="article.subtitle"
            class="subtitle"
        >
            {{article.subtitle}}
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
export default class ArticlePreviewsTitleCard extends Vue {
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
        font-size: 2.1em;
        line-height: 1.8em;
    }

    .subtitle {
        font-weight: lighter;
        padding-left: 2em;
        font-size: 1.9em;
        line-height: 1.4em;
    }

    .author {
        margin-top: 3px;

        font-size: 1.5em;
        font-weight: lighter;
        font-style: italic;
    }


</style>