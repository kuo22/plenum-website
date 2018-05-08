<template>
  <div class="menu">
      {{ $route.params.filtersList }}
      <br>
      <br>

    <ProjectTextMenu v-bind:projects="filteredProjects"/>
    <VisualMenu v-bind:projects="filteredProjects"/>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import VisualMenu from '@/components/VisualMenu';
import ProjectTextMenu from '@/components/ProjectTextMenu';
import Project from '../interfaces/Project';
import {Projects} from '../enums/Projects';

@Component({
  components: {
      VisualMenu,
      ProjectTextMenu,
  },
})
export default class Menu extends Vue {

    constructor() {
        super();

    }

    get filterTopics(): string[] {
        return this.$route.path.substr(6, this.$route.path.length).split('&');
    }

    get filteredProjects(): Project[] {
        return this.projects.filter((project) => {
            project = project as Project;
            let flag = false;
            const filterTopics = this.filterTopics;
            for (const topic of filterTopics) {
                for (const category of project.filterCategories) {
                    if (category === topic) {
                        flag = true;
                    }
                }
            }
            return flag;
        });
    }

    get projects(): Project[] {
        const projects = new Projects();
        return projects.allProjects;
    }
}
</script>

<style>
    #filter-menu {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -110px;
        margin-left: -150px;
    }
</style>
