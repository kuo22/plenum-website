<template>
    <ul
        class="nav"
        role="menu"
    >
        <li
            class="nav__menu-item nav__menu-item--back"
            :class="{ 'nav__menu-item--hovered': backHovered || allVisible }"
            @mouseover="backHovered = true"
            @mouseleave="backHovered = false"
        >
            <a

            >
                <img
                    src="../assets/nav/left-arrow.svg"
                    @mouseover="backArrowHovered = true"
                    @mouseleave="backArrowHovered = false"
                />
                <transition name="title-card-fade">
                    <text-article-title-card
                            v-show="backArrowHovered"
                            role="presentation"
                            :hideTitleCard="false"
                            :article="previousArticle"
                    ></text-article-title-card>
                </transition>
            </a>
        </li>
        <li
            class="nav__menu-item nav__menu-item--forward"
            :class="{ 'nav__menu-item--hovered': forwardHovered || allVisible }"
            @mouseover="forwardHovered = true"
            @mouseleave="forwardHovered = false"
        >
            <a

            >
                <transition name="title-card-fade">
                    <text-article-title-card
                            v-show="forwardArrowHovered"
                            class="nav__title-card--forward"
                            role="presentation"
                            :hideTitleCard="false"
                            :article="nextArticle"
                    ></text-article-title-card>
                </transition>
                <img
                    src="../assets/nav/right-arrow.svg"
                    @mouseover="forwardArrowHovered = true"
                    @mouseleave="forwardArrowHovered = false"
                />
            </a>
        </li>
    </ul>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
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

    private backHovered: boolean;
    private forwardHovered: boolean;

    private backArrowHovered: boolean;
    private forwardArrowHovered: boolean;

    private $route: Route;

    constructor() {
        super();

        this.backHovered = false;
        this.forwardHovered = false;

        this.backArrowHovered = false;
        this.forwardArrowHovered = false;
    }

    // When view is mounted, retrieve article
    public created() {
        // Filler
    }

    // @Emit('navArrowHovered')
    // private navArrowHovered(isForwardArrow: number) {
    //     if (isForwardArrow) { // forward button
    //         this.forwardArrowHovered = true;
    //     } else {
    //         this.backArrowHovered = true;
    //     }
    // }
    //
    // @Emit('navArrowUnhovered')
    // private navArrowUnhovered(isForwardArrow: number) {
    //     if (isForwardArrow) { // forward button
    //         this.forwardArrowHovered = false;
    //     } else {
    //         this.backArrowHovered = false;
    //     }
    // }

    private onNavItemHovered(e): void {
        // Filler
    }
}
</script>

<style lang="scss" scoped>
    .nav {
        position: absolute;
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

    .nav__menu-item--hovered a {
        opacity: 1;
        transition: opacity 250ms ease;

    }

    .nav__menu-item--back {
        left: calc(240px + 3px);
    }

    .nav__menu-item--forward {
        right: 0;
    }

    .nav__title-card--forward {
        box-shadow: -8px 8px 10px 2px #00000029 !important;
    }

    .nav__menu-item a img {
        position: relative;
        display: inline-block;
        order: 0;
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