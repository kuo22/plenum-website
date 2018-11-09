<template>
    <main ref="home" class="content-container">
        <!-- TODO: use component associated with given content-type -->
        <basic-page
            v-for="page in pages"
            :page="page"
        ></basic-page>
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

export default class About extends Vue {
    private pages: Array<any>;

    constructor() {
        super();

        this.pages = [];
    }

    // When view is mounted, retrieve article
    private created() {
        this.initAboutPage();
    }

    private initAboutPage(): void {
        if (this.$store.getters['pages/getAboutPage'].length === 0) {
            this.$store.dispatch('pages/initAboutPage')
                .then(res => {
                    this.pages = this.$store.getters['pages/getAboutPage'];
                });
        } else {
            this.pages = this.$store.getters['pages/getAboutPage'];
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
