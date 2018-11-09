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
import {Component, Vue, Watch} from "vue-property-decorator";
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
        this.page = undefined;
        this.getPage();
    }

    private getPage(): void {
        let menuPage = this.getPageMetaDataFromMenuTree(this.$route.path);

        let pages = this.$store.getters['pages/getPages'];

        if (menuPage.uuid && !pages.some(page => page.uuid === menuPage.uuid)) {
            this.$store.dispatch('pages/fetchPage', menuPage.uuid)
                .then(res => {
                    pages = this.$store.getters['pages/getPages'];
                    this.page = pages.find(page => page.uuid === menuPage.uuid);
                });
        } else {
            this.page = pages.find(page => page.uuid === menuPage.uuid);
        }
    }

    // Returns simplified data via the menu tree of the page represented in the provided path
    // parameter(s) needed:
    //      path = url path to a page e.g. '/section/page'
    private getPageMetaDataFromMenuTree(path: string) {
        const menuTree = this.$store.getters['menuTree/menuTree'];

        let pathParts;
        let section;
        let pageTitle;
        let menuPage;

        let slashCount = (path.match(/\//g) || []).length;
        if (slashCount === 2) {
            pathParts = path.slice(1).split('/');
            section = pathParts[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            pageTitle = pathParts[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            menuPage = menuTree
                .find(mainMenuItem => mainMenuItem.title.toLowerCase() === section.toLowerCase())
                .submenu.find(page => page.title.toLowerCase() === pageTitle.toLowerCase());
        } else if (slashCount === 1) {
            pageTitle = path.slice(1).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            menuPage = menuTree
                .find(mainMenuItem => mainMenuItem.title.toLowerCase() === pageTitle.toLowerCase())
        }

        return menuPage;
    }
}
</script>

<style lang="scss" scoped>

</style>
