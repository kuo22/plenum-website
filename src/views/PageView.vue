<template>
    <main ref="home" class="content-container">
        <!-- TODO: use component associated with given content-type -->
        <basic-page
            v-if="Object.keys(page).length > 0"
            :page="page"
        ></basic-page>
        <hr v-if="Object.keys(page).length > 0">
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

export default class PageView extends Vue {
    private page: any;

    constructor() {
        super();

        this.page = {};
    }

    // When view is mounted, retrieve article
    private mounted() {
        this.getPage();
    }

    // TODO: universalize 'Publication' method of waiting for menutree to load
    // Put delay in router? For first visit, don't load any views until menu tree is ready?
    private getPage(): void {
        let pathParts = this.$route.path.slice(1).split('/');
        const theme = pathParts[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const pageTitle = pathParts[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        const menuTree = this.$store.getters['menuTree/menuTree'];
        // this.page = this.$store.getters['menuTree/'];
        // this.$store.dispatch('pages/initFrontPage')
        //     .then(response => {
        //         this.pages = this.$store.getters['pages/getFrontPage'];
        //     })
    }
}
</script>

<style lang="scss" scoped>

</style>
