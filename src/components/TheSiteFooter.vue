<template>
    <footer
            class="footer-container"
            role="contentinfo">
        <ul class="uw-menu">
            <li class="uw-menu-item">
                <a
                    href="https://www.washington.edu/online/privacy"
                    target="_blank"
                    rel="noopener noreferrer"

                    class="focusable"
                    tabindex="0"
                >
                    <span
                            class="focusable__content"
                            tabindex="-1"
                    >Privacy</span>
                </a>
            </li>
            <li class="uw-menu-item">
                <a
                    href="https://www.washington.edu/online/terms"
                    target="_blank"
                    rel="noopener noreferrer"

                    class="focusable"
                    tabindex="0"
                >
                    <span
                        class="focusable__content"
                        tabindex="-1"
                    >Terms</span>
                </a>
            </li>
            <li class="uw-menu-item">
                <a
                    href="https://geography.washington.edu/"
                    target="_blank"
                    rel="noopener noreferrer"

                    class="uw-logo focusable"
                    tabindex="0"
                >
                    <svg
                        class="uw-logo__svg focusable__content"
                        tabindex="-1"
                        version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        width="107.999px" height="72.621px" viewBox="349.125 314.318 107.999 72.621"
                        enable-background="new 349.125 314.318 107.999 72.621" xml:space="preserve">
                        <path d="M428.384,314.318c0,0.858,0,12.238,0,13.099c0.856,0,9.206,0,9.206,0l-10.277,38.251
                            c0,0-12.577-50.636-12.757-51.35c-0.687,0-12.626,0-13.303,0c-0.188,0.697-13.796,51.353-13.796,51.353l-9.466-38.254
                            c0,0,8.726,0,9.585,0c0-0.858,0-12.239,0-13.099c-0.919,0-37.532,0-38.451,0c0,0.858,0,12.238,0,13.099c0.851,0,8.52,0,8.52,0
                            s14.703,58.81,14.881,59.522c0.708,0,19.941,0,20.639,0c0.183-0.697,9.852-37.455,9.852-37.455s9.188,36.748,9.364,37.455
                            c0.707,0,19.941,0,20.639,0c0.187-0.703,15.656-59.522,15.656-59.522s7.601,0,8.449,0c0-0.858,0-12.239,0-13.099
                            C456.217,314.318,429.292,314.318,428.384,314.318z"></path>
                    </svg>
                </a>
            </li>
        </ul>
    </footer>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component({
    components: {

    },
})

export default class TheSiteFooter extends Vue {

    constructor() {
        super();
    }

    // When view is mounted, retrieve article
    private created() {
    }
}


</script>

<style lang="scss" scoped>
    @import '../styles/_settings';

    .uw-menu {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        padding: 0 10px;
    }

    .uw-menu-item {
        position: relative;
        display: inline-block;
        font-weight: normal;

        margin: 0 0.5em 0 0;

        vertical-align: middle;
    }

    .uw-menu-item:last-child {
        margin-left: 0.5em;
        margin-right: 0;
        width: 3.5em;
    }

    .uw-menu-item a span {
        font-size: 1.2em;
        padding: 5px;
    }

    .uw-logo__svg {
        position: relative;
        height: calc(0.75 * #{$footerHeight}); /* 60px is height of foot */
        width: auto;

        outline: 0 solid transparent !important; // Remove focusable outline
    }

    .uw-logo__svg > path {
        fill: #D8D9DA;
    }

    .uw-logo:focus > .uw-logo__svg > path {
        fill: #000000;
    }
</style>