<template>
    <div>
        <!-- TODO: make menu table of contents the 'main' section for this url? -->
    </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import { Route } from 'vue-router';

@Component({
    components: {

    }
})

export default class Publication extends Vue {
    private $route: Route;

    constructor() {
        super();
    }

    private created() {
        this.openTableOfContents();
    }

    // TODO: globalize URL decoding/ encoding
    private openTableOfContents() {
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
