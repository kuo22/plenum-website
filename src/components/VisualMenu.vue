<template>
    <div class="VisualMenu">
        <ul id="menu" style="list-style-type:none">
            <VisualMenuEntry v-for="project in projectsArray" v-bind:project="project"/>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import VisualMenuEntry from './VisualMenuEntry.vue';
import Project from '../interfaces/Project';

@Component({
    components: {VisualMenuEntry},
})
export default class VisualMenu extends Vue {
    @Prop() private projects!: Project[];
    @Prop() private projectsArray: Project[];

    constructor() {
        super();

        this.projectsArray = Array.from(this.projects);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .VisualMenu {
        position: absolute;
        top: 215px;
        left: 15px;
        padding-bottom: 100%;
    }

    .VisualMenu * {
        width: 100px;
    }
</style>
