<template>
    <article
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
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component({
    components: {

    },
})

// Description of Vue component
export default class BasicPage extends Vue {
    @Prop() page!: any;

    constructor() {
        super();
    }

}
</script>

<style lang="scss" scoped>
    @import '../../styles/basic-page';
</style>
