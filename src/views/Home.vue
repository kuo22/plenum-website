<template>
    <main class="content-container">
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

    .content-container::-webkit-scrollbar {
        width: 0;
        position: fixed;
        right: 0;
    }

    .content-container::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    }

    .content-container::-webkit-scrollbar-thumb {
        background-color: darkgrey;
        outline: 1px solid slategrey;
    }
</style>
