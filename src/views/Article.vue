<template>
    <div id="article">
        Hello
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component({
        components: {

        },
    })

    export default class Article extends Vue {

        constructor() {
            super();
        }

    }
</script>

<style>

</style>
