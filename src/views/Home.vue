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

    .basic-page {
        text-align: left;
    }

    .basic-page:last-of-type {
        margin-bottom: 50px;
    }

    .basic-page__title {
        height: 240px;
        line-height: 240px;
        vertical-align: middle;
        font-weight: bold;

        font-size: 6em;
    }

    .basic-page__section {
        padding-left: 50px;
    }

    .basic-page__section /deep/ > *:not(h2) {
        padding-left: 2%;
        font-family: 'Amiri', serif;
        font-size: 2.25em;
        line-height: 1.3em;
    }

    .basic-page__section /deep/ ol {
        margin-left: 50px;
    }

    .basic-page__section /deep/ ol li {
        list-style-type: decimal;
    }

    .basic-page__section /deep/ > * > * {
        font-size: 1em;
        line-height: 1.3em;
    }

    .basic-page__section /deep/ p:first-of-type {
        padding-top: 0;
    }

    .basic-page__section /deep/ p {
        padding: 15px 0;
    }

    .basic-page__section /deep/ p:last-of-type {
        padding-bottom: 0;
    }

    .basic-page__section /deep/ h2 {
        font-weight: normal;
        font-size: 3em;
        margin-left: 100px;
        padding: 30px 0;
    }

    .basic-page__section:first-of-type /deep/ h2 {
        padding-top: 0;
    }


</style>
