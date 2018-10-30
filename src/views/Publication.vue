<template>
    <div>
        <!-- TODO: make menu table of contents the 'main' section for this url? -->
    </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import { Route } from 'vue-router';
import APIService from '@/API';

@Component({
    components: {

    }
})

export default class Publication extends Vue {
    private $route: Route;
    private menuInitialized: boolean;
    private unwatchMenu;

    constructor() {
        super();
        this.menuInitialized = false;
        this.unwatchMenu = () => {};
    }

    @Watch('$route')
    private onRouteChanged(val, oldVal) {
        if (this.menuInitialized) {
            this.openTableOfContents();
        }
    }

    private created() {
        this.unwatchMenu = this.$watch(
            () => {
                return this.$store.getters['menuTree/menuTree'].length;
            },
            (newLength, oldLength) => {
                if (newLength > 0) {
                    this.openTableOfContents();
                }
            }
        )
    }

    private openTableOfContents() {
        if (!this.menuInitialized) {
            this.unwatchMenu();
            this.menuInitialized = true;
        }

        const pubParam: string = this.$route.params.publication;
        const pubTitle = pubParam
            .replace(/-/g, ' ') // Replace dashes with spaces
            .replace(/(^|\s)\S/g, letter => letter.toUpperCase()); // Capitalize all words
        const openPub = this.$store.getters['menuTree/openPublication'];
        if (openPub.title !== pubTitle) {
            if (this.$store.getters['menuTree/menuTree'].length !== 0) {
                this.$store.dispatch('menuTree/activateSubmenuPreviewByTitle', pubTitle);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "../styles/_settings";
</style>
