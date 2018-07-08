<template>
    <div id="table-of-contents">
        Hello
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {Article, Issue} from '../types/types';
import {API} from '../classes/API';
import {Route} from 'vue-router';

@Component({
    components: {

    },
})

export default class TableOfContents extends Vue {
    @Prop() private issue: Issue;
    @Prop() private articles: Article[];
    private api = new API();
    private $route: Route;

    constructor() {
        super();
    }

    private mounted() {
        // empty
    }

}
</script>

<style>

</style>
