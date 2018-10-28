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
                >
                    <span>Privacy</span>
                </a>
            </li>
            <li class="uw-menu-item">
                <a
                    href="https://www.washington.edu/online/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span>Terms</span>
                </a>
            </li>
            <li class="uw-menu-item">
                <a
                    href="https://geography.washington.edu/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img class="uw-logo" src="../assets/uw-logo.png">
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
    .uw-menu {
        height: 100%;
        position: absolute;
        right: 0;
        padding: 0 15px;
    }

    .uw-menu-item {
        position: relative;
        display: inline-block;
        font-weight: normal;
        font-size: 10px;

        margin: 0 10px;

        vertical-align: middle;
    }

    .uw-menu-item:first-child {
        margin-left: 0;
    }

    .uw-menu-item:last-child {
        margin-right: 0;
    }

    .uw-logo {
        position: relative;
        height: calc(0.75 * 60px); /* 60px is height of foot */
        width: auto;
    }
</style>