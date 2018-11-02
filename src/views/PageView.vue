<template>
    <main ref="home" class="content-container">
        <!-- TODO: use component associated with given content-type -->
        <basic-page
            v-if="page && Object.keys(page).length > 0"
            :page="page"
        ></basic-page>
        <hr
            v-if="page && Object.keys(page).length > 0"
        >
    </main>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from "vue-property-decorator";
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

    @Watch('$route.path')
    private onRouteChanged(newVal, oldVal) {
        console.log('route changed');
        this.page = {};
        this.getPage();
    }

    // TODO: universalize 'Publication' method of waiting for menutree to load
    // Put delay in router? For first visit, don't load any views until menu tree is ready?
    private getPage(): void {
        let pathParts = this.$route.path.slice(1).split('/');
        // TODO: separate processing of single path URLs and of twice-nested URLs
        const section = pathParts[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const pageTitle = pathParts[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        console.log(section, pageTitle);

        const menuTree = this.$store.getters['menuTree/menuTree'];
        let menuPage = menuTree.find(mainMenuItem => mainMenuItem.title.toLowerCase() === section.toLowerCase()).submenu.find(page => page.title.toLowerCase() === pageTitle.toLowerCase());

        let pages = this.$store.getters['pages/getPages'];
        if (!pages.some(page => page.node === parseInt(menuPage.node))) {
            this.$store.dispatch('pages/getPage', menuPage.node)
                .then(res => {
                    pages = this.$store.getters['pages/getPages'];
                    this.page = pages.find(page => page.node === parseInt(menuPage.node));
                });
        } else {
            this.page = pages.find(page => page.node === parseInt(menuPage.node));
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
