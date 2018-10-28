<template>
    <ul
        class="nav"
        role="menu"
    >
        <li
            v-for="(navButton, index) in navButtons"
            class="nav__option"

            :class="{
                'nav__option--visible': navButton.hovered || allVisible,
                'nav__option--previous': navButton.direction === 'previous',
                'nav__option--forward': navButton.direction === 'forward',
            }"

            @mouseover="navButton.hovered = true"
            @mouseleave="navButton.hovered = false"
        >
            <a
                v-if="navButton.direction === 'previous' && previousArticle !== undefined"
                :tabindex="index === 0 ? 0 : -1"

                @focus="focusedIndex = index"
                @blur="focusedIndex = 0"
            >
                <img
                    role="presentation"
                    :src="getImageSource(navButton.direction)"

                    @mouseover="navArrowHovered(index)"
                    @mouseleave="navArrowUnhovered(index)"
                />
            </a>
            <transition name="title-card-fade">
                <text-article-title-card
                        v-show="navButton.arrowHovered"
                        role="presentation"
                        :class="index === 0 ? 'title-card-container--previous' : 'title-card-container--forward'"

                        :title="navButton.article.title"
                        :subtitle="navButton.article.subtitle"
                        :author="navButton.article.author.firstName + ' ' + navButton.article.author.lastName"
                        :hideTitleCard="false"
                ></text-article-title-card>
            </transition>
            <a
                v-if="navButton.direction === 'forward' && nextArticle !== undefined"
                :tabindex="index === 0 ? 0 : -1"

                @focus="focusedIndex = index"
                @blur="focusedIndex = 0"
            >
                <img
                    role="presentation"
                    :src="getImageSource(navButton.direction)"

                    @mouseover="navArrowHovered(index)"
                    @mouseleave="navArrowUnhovered(index)"
                />
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
        //console.log('hovered');
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
        left: 243px;
        top: 0;
        width: calc(100% - 243px);
        height: 100vh;
        z-index: 3;
    }

    .nav__option {
        position: absolute;
        top: calc(240px - 27px); // Bottom of the headroom title card
        width: fit-content;
        height: calc(100vh - 240px + 27px - 6vh); // 27px = margin around headroom title card
    }

    // TODO: universalize focus transition and keybaord focus nav
    .nav__option:focus {
        outline: none;
    }
    .nav__option a:focus {
        outline: none;
        opacity: 1;
        transition: opacity 250ms ease;
    }
    .nav__option a:focus > img {
        outline: 3px solid black;
        opacity: 1;
        transition: opacity 250ms ease;
    }

    .nav__menu-button-container {
        position: relative;
        top: 0;
        left: 0;
        width: calc((50vw - 243px) / 2); // Page takes up 50% of screen
        height: 100%;
    }

    .nav__option a {
        position: relative;
        display: inline-block;
        left: 0;
        top: 0;
        // transform: translateY(0);
        width: calc((50vw - 243px) / 2);
        height: calc(100vh - 240px + 27px - 6vh);
        margin: 0 auto;

        opacity: 0;
        transition: opacity 150ms ease;

        align-items: center;
    }

    .nav__option a:hover {
        cursor: pointer;
    }

    .nav__option--visible a {
        opacity: 1;
        transition: opacity 250ms ease;
    }

    .nav__option--previous {
    }

    .nav__option--forward {
        right: 0;
    }

    .nav__title-card--forward {
        box-shadow: -8px 8px 10px 2px #00000029 !important;
    }

    .nav__option a img {
        position: relative;
        display: inline-block;
        top: 50%;
        transform: translateY(-50%);
        width: auto;
        height: 50vh;
    }

    .title-card-container--previous {
        position: relative;
        display: inline-block;
        left: -8%;
        top: -12%;
    }

    .title-card-container--forward {
        position: relative;
        display: inline-block;
        left: 8%;
        top: -12%;
    }

    /* Title Card Fade Animation */

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