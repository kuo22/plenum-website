<template>
  <div class="project">
      <h1>{{ $route.params.project }}</h1>
      <h2>{{project.year}}</h2>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import Project from '@/interfaces/Project';

@Component({
  components: {

  },
})
export default class ProjectPage extends Vue {
    @Prop() public project!: Project;
    // TODO: figure out how to get project into this view, right now, the Project object stops at MenuEntry(s)

    constructor() {
        super();

    }
}
</script>

<style>

</style>
