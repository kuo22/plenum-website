<template>
    <main class="content-container">
        <article
                v-for="page in pages"
                class="basic-page"
        >
            <h1 class="basic-page__title">
                {{page.title}}
            </h1>
            <section
                class="basic-page__section"
                v-for="section in page.body"
                v-html="section.processed"
            ></section>
        </article>
        <hr>
    </main>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component({
    components: {

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
    @import '../styles/basic-page';
</style>
