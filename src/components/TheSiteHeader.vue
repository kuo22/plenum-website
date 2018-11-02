<template>
    <vue-headroom
            :disabled="this.$route.path.includes('content')"
            :classes="{
                initial :   'site-headroom',
                pinned :    'site-headroom--pinned',
                unpinned :  'site-headroom--unpinned',
                top :       'site-headroom--top',
                notTop :    'site-headroom--not-top',
                bottom :    'site-headroom--bottom',
                notBottom : 'site-headroom--not-bottom'
            }"
            :class="{'site-headroom--hidden': this.$route.path.includes('content')}"
            :speed="350"
            :z-index="9"
    >


    <header class="site-header">
        <div class="site-header__title-container">
            <img class="site-header__title" src="@/assets/plenum-title.svg">
            <img
                :class="{'site-header__subtitle--hidden': this.$route.path.includes('publications')}"
                class="site-header__subtitle"
                src="@/assets/plenum-subtitle.svg"
            >
        </div>
    </header>
    </vue-headroom>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component({
    components: {

    },
})

// The header for the entire site
// Disappears when
// Required properties:
export default class TheSiteHeader extends Vue {
    constructor() {
        super();
    }
}


</script>

<style lang="scss" scoped>
    @import '../styles/_settings';

    .site-headroom {
        width: $appWidth;
        height: $headerHeight;
    }

    .site-headroom--hidden {
        display: none;
    }

    .site-headroom--not-top.site-headroom--pinned > .site-header {
        border-bottom: 1px solid black;
    }

    .site-header {
        width: calc(#{$appWidth} - #{$headerHeight} - #{$rightPageNavWidth});
        height: $headerHeight;
        position: absolute;
        top: 0;
        left: $lefterWidth;

        background: white;
    }

    .site-header__title-container {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);

        vertical-align: middle;
    }

    .site-header__title {
        display: inline-block;
        left: 0;
        width: 6em;
        margin-right: 1em;

        vertical-align: middle;
    }

    .site-header__subtitle {
        display: inline-block;
        width: 20em;
        left: 0;

        vertical-align: middle;

        opacity: 1;
    }

    .site-header__subtitle--hidden {
        opacity: 0;

        transition: opacity 0.3s ease;
    }
</style>