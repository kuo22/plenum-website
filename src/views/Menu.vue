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
                for (const category of project.categories) {
                    if (category === topic) {
                        flag = true;
                    }
                }
            }
            return flag;
        });
    }

    get projects(): Project[] {
        return [
            new Project(
                'whitevoidfill',
                'void',
                2016,
                ['art'],
            ),
            new Project(
                'cache',
                'cache',
                2016,
                ['art'],
                [
                    'Alex Boechenstein',
                    'Max Cleary',
                ],
            ),
            new Project(
                'aeolus',
                'aeolus',
                2013,
                ['architecture'],
                [
                    'Monica Beatriz',
                ],
            ),
            new Project(
                'le fresnoy 2.0',
                'fresnoy',
                2014,
                ['architecture'],
            ),
            new Project(
                'home for sale(s)',
                'home',
                2015,
                ['art', 'architecture'],
            ),
        ];
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
