<template>
    <div id="home">
        Home Page w/ Highlight News
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component({
        components: {

        },
    })

    export default class Home extends Vue {

        constructor() {
            super();
        }

    }
</script>

<style>
    #home {

    }
</style>
