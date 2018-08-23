<template>
    <ul
        class="nav"
        role="menu"
    >
        <li
            v-for="(navButton, index) in navButtons"
            class="nav__menu-item"

            :class="{
                'nav__menu-item--visible': navButton.hovered || focusedIndex === index || allVisible,
                'nav__menu-item--previous': navButton.direction === 'previous',
                'nav__menu-item--forward': navButton.direction === 'forward',
            }"

            @mouseover="navButton.hovered = true"
            @mouseleave="navButton.hovered = false"
        >
            <a
                :tabindex="index === 0 ? 0 : -1"
                @focus="focusedIndex = index"
                @blur="focusedIndex = -1"
            >
                <img
                    :src="getImageSource(navButton.direction)"
                    :style="{ order: index }"

                    @mouseover="navArrowHovered(index)"
                    @mouseleave="navArrowUnhovered(index)"
                />
                <transition name="title-card-fade">
                    <text-article-title-card
                        v-show="navButton.arrowHovered || focusedIndex === index"
                        role="presentation"

                        :title="navButton.article.title"
                        :subtitle="navButton.article.subtitle"
                        :author="navButton.article.author.firstName + ' ' + navButton.article.author.lastName"
                        :hideTitleCard="false"
                    ></text-article-title-card>
                </transition>

            </a>
        </li>
    </ul>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import { Route } from 'vue-router';
import { Article } from '@/types/types';
import TextArticleTitleCard from '@/components/TextArticleTitleCard';

@Component({
    components: {
        TextArticleTitleCard,
    },
})

export default class TextArticleNavigation extends Vue {
    @Prop() private allVisible!: boolean;
    @Prop() private previousArticle!: Article;
    @Prop() private nextArticle!: Article;

    private navButtons: Array<{}>;
    private focusedIndex: number;

    private $route: Route;

    constructor() {
        super();

        this.navButtons = [
            {
                direction: 'previous',
                hovered: false,
                arrowHovered: false,
                article: this.previousArticle,
            },
            {
                direction: 'forward',
                hovered: false,
                arrowHovered: false,
                article: this.nextArticle,
            },
        ];

        this.focusedIndex = -1;
    }

    // When view is mounted, retrieve article
    public created() {
        // Filler
    }

    @Emit('navArrowHovered')
    private navArrowHovered(navButtonIndex: number): void {
        this.navButtons[navButtonIndex].arrowHovered = true;
        // Filler
    }

    @Emit('navArrowUnhovered')
    private navArrowUnhovered(navButtonIndex: number): void {
        this.navButtons[navButtonIndex].arrowHovered = false;
    }

    // Returns the image file path that was transmuted by webpack
    private getImageSource(direction: string): string {
        const arrows = require.context('../assets/nav/', false, /\.svg$/);
        return arrows('./' + direction + '-arrow.svg');
    }
}
</script>

<style lang="scss" scoped>
    .nav {
        position: fixed;
        width: calc(100% - 60px);
        height: calc(100% - 60px);
        padding: 30px;
        z-index: 3;
    }

    .nav__menu-item {
        position: fixed;
        top: 50%;
        transform: translateY(-50%);
        width: fit-content;
        height: 100vh;
    }

    .nav__menu-item a {
        position: relative;
        display: flex;
        height: fit-content;
        top: 50%;
        transform: translateY(-50%);

        opacity: 0;
        transition: opacity 150ms ease;

        align-items: center;
    }

    .nav__menu-item a:hover {
        cursor: pointer;
    }

    .nav__menu-item--visible a {
        opacity: 1;
        transition: opacity 250ms ease;

    }

    .nav__menu-item--previous {
        left: calc(240px + 3px);
        padding-right: calc((100vw - 243px - 50vw) / 4);
    }

    .nav__menu-item--forward {
        right: 0;
        padding-left: calc((100vw - 243px - 50vw) / 4);
    }

    .nav__title-card--forward {
        box-shadow: -8px 8px 10px 2px #00000029 !important;
    }

    .nav__menu-item a img {
        position: relative;
        display: inline-block;
        width: auto;
        height: 50vh;
        /*max-width: 100%;*/
        /*max-height: 60%;*/
        /*min-height: 240px;*/
    }

    .title-card-fade-enter {
        opacity: 0;
    }
    .title-card-fade-enter-active {
        transition: opacity 250ms ease;
    }
    .title-card-fade-enter-to {
        opacity: 1;
    }
    .title-card-fade-leave {
        opacity: 1;
    }
    .title-card-fade-leave-active {
        transition: opacity 150ms ease;

    }
    .title-card-fade-leave-to {
        opacity: 0;
    }
</style>