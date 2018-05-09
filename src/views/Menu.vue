<template>
  <div class="menu">
      {{ filtersList }}

      <ProjectTextMenu v-bind:projects="filteredProjects"/>
      <VisualMenu v-bind:projects="filteredProjects"/>

      <img id="filter" src="../assets/filter.svg">
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import VisualMenu from '@/components/VisualMenu';
import ProjectTextMenu from '@/components/ProjectTextMenu';
import Project from '@/interfaces/Project';
import {Projects} from '@/enums/Projects';

@Component({
  components: {
      VisualMenu,
      ProjectTextMenu,
  },
})

export default class Menu extends Vue {
    @Prop() public filtersList!: string; // Parameters of URL

    private filters: string[] = this.filtersList.split('&'); // Separated whitelist filters
    private whitelistedProjects: Project[] =
        this.whitelistFilterProjects(this.projects(), this.filters); // Whitelisted Projects

    constructor() {
        super();
    }

    // Filters out unwanted projects that don't belong to the provided project filter categories
    // by keeping the projects with categories that match the provided filters
    // parameter(s) needed:
    //      filters = list of whitelist filters
    private whitelistFilterProjects(projects: Project[], filters: string[]): Project[] {
        return projects.filter((project) => {
            project = project as Project;
            let flag = false;

            for (const topic of filters) {
                for (const category of project.filterCategories) {
                    if (category === topic) {
                        flag = true;
                    }
                }
            }
            return flag;
        });
    }

    // Returns every project available
    private projects(): Project[] {
        return new Projects().allProjects;
    }

    // Return the whitelist filtered projects
    get filteredProjects(): Project[] {
        return this.whitelistedProjects;
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

    #filter {
        position: absolute;
        left: 15px;
        bottom: 15px;
        width: 35px;
    }

    #filter:hover {
        cursor: pointer;
    }
</style>
