<template>
    <div
        class="title-card__container"
        :class="{ 'title-card__container--hidden': hideTitleCard }"
    >
        <h1 class="title-card__title">
            {{ title }}
        </h1>
        <h2 class="title-card__subtitle">
            {{ subtitle }}
        </h2>
        <h3 class="title-card__author">
            {{ author }}
        </h3>
    </div >
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import { Route } from 'vue-router';
    import { Article } from '@/types/types';

    @Component({
        components: {
        },
    })

    export default class TextArticleTitleCard extends Vue {
        @Prop() private title!: string;
        @Prop() private subtitle!: string;
        @Prop() private author!: string;
        @Prop({ default: false }) private hideTitleCard!: boolean;

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
        max-width: 50vw;
        padding: 20px;
        z-index: -1;

        box-shadow: 8px 8px 10px 2px #00000029;

        background: white;

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
        margin-left: 30px;

        text-align: left;
    }

    .title-card__author {
        margin-top: 15px;

        font-style: italic;
        text-align: left;
    }
</style>