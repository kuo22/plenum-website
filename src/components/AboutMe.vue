<template>
    <div class="about-me-container">
        HELLO!
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ProjectTextMenuEntry from './ProjectTextMenuEntry.vue';
import Project from '../interfaces/Project';

@Component({
    components: {},
})
export default class AboutMe extends Vue {

    constructor() {
        super();

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
