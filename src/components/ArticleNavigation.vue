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
                @mouseover="onNavItemHovered"
            >
                <img src="../assets/nav/left-arrow.svg"/>
            </a>
        </li>
        <li
            class="nav__menu-item nav__menu-item--forward"
            :class="{ 'nav__menu-item--hovered': forwardHovered || allVisible }"
            @mouseover="forwardHovered = true"
            @mouseleave="forwardHovered = false"
        >
            <a
                @mouseover="onNavItemHovered"
            >
                <img src="../assets/nav/right-arrow.svg"/>
            </a>
        </li>
    </ul>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import { Route } from 'vue-router';
import { Article } from '@/types/types';

@Component({
    components: {
    },
})

export default class ArticleNavigation extends Vue {
    @Prop() public allVisible!: boolean;
    private backHovered: boolean;
    private forwardHovered: boolean;

    private $route: Route;

    constructor() {
        super();

        this.backHovered = false;
        this.forwardHovered = false;
    }

    // When view is mounted, retrieve article
    public created() {
        // Filler
    }

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
        width: 6vw;
        height: 100vh;
    }

    .nav__menu-item a {
        opacity: 0;
        transition: opacity 150ms ease;
    }

    .nav__menu-item a:hover {
        cursor: pointer;
    }

    .nav__menu-item--hovered a {
        opacity: 1;
        transition: opacity 150ms ease;

    }

    .nav__menu-item--back {
        left: calc(240px + 3px);
    }

    .nav__menu-item--forward {
        right: 0;
    }

    .nav__menu-item a img {
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        height: auto;
        width: auto;
        max-height: 100%;
        max-width: 100%;
    }
</style>