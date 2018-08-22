<template>
    <div
        class="title-card__container"
        :class="{ 'title-card__container--hidden': hideTitleCard }"
    >
        <div>
            <h1 class="title-card__title">
                {{ article.title }}
            </h1>
            <h2 class="title-card__subtitle">
                {{  article.subtitle }}
            </h2>
        </div>
        <h3 class="title-card__author">
            <em>
                {{ article.author.firstName }} {{ article.author.lastName }}
            </em>
        </h3>
    </div >
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import { Route } from 'vue-router';
    import { Article } from '@/types/types';

    @Component({
        components: {
        },
    })

    export default class TextArticleNavigation extends Vue {
        @Prop() private article!: boolean;
        @Prop() private hideTitleCard!: boolean;

        private $route: Route;

        constructor() {
            super();
        }

        // When view is mounted, retrieve article
        public created() {
            // Filler
        }
    }
</script>

<style lang="scss" scoped>
    .title-card__container {
        position: relative;
        left: 0;
        //top: 50%;
        //transform: translateY(-50%);
        padding: 20px;
        z-index: -1;

        background: white;

        box-shadow: 8px 8px 10px 2px #00000029;

        text-align: left;
    }

    .title-card__container--hidden {
        background: transparent;

        opacity: 0;
        transition: opacity 150ms ease;
    }

    .title-card__title,
    .title-card__subtitle,
    .title-card__author {
        font-weight: normal;
        font-style: normal;
    }

    .title-card__subtitle {
        text-align: left;
        margin-left: 30px;
    }

    .title-card__author {
        text-align: left;
        margin-top: 15px;
    }
</style>