<template>
    <main>
        <section v-for="page in pages">
            <h1>
                {{page.title}}
            </h1>
            <p
                v-for="section in page.body"
                v-html="section.processed"
            ></p>
            <hr>
        </section>
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

<style>
</style>
