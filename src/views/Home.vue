<template>
    <main ref="home" class="content-container">
        <!-- TODO: use component associated with given content-type -->
        <basic-page
            v-for="page in pages"
            :page="page"
        ></basic-page>
        <hr v-if="pages.length > 0">
    </main>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import BasicPage from '../components/content-types/BasicPage';

@Component({
    components: {
        BasicPage
    },
})

export default class Home extends Vue {
    private pages: Array<any>;

    constructor() {
        super();

        this.pages = [];
    }

    // When view is mounted, retrieve article
    private created() {
        this.initFrontPage();
    }

    private initFrontPage(): void {
        this.$store.dispatch('pages/initFrontPage')
            .then(response => {
                this.pages = this.$store.getters['pages/getFrontPage'];
            })
    }
}
</script>

<style lang="scss" scoped>

</style>
