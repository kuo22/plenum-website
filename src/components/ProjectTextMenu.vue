<template>
    <div class="FieldMenu">
        <ul id="menu" style="list-style-type:none">
            <ProjectTextMenuEntry v-for="project in projectsArray" v-bind:project="project"/>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ProjectTextMenuEntry from './ProjectTextMenuEntry.vue';
import Project from '../interfaces/Project';

@Component({
    components: {ProjectTextMenuEntry},
})
export default class ProjectTextMenu extends Vue {
    @Prop() private projects!: Project[];
    private projectsArray: Project[];

    constructor() {
        super();

        this.projectsArray = Array.from(this.projects);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .FieldMenu {
        position: relative;
        top: 215px;
        right: 15px;
        padding-bottom: 100%;
        font-family: 'Cousine';
        font-weight: 400;
        font-size: 14px;
        text-align: right;
    }

    .FieldMenu * {
        padding: 15px 0 0 0;
    }
</style>
