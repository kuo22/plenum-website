<template>
  <div class="project">
      <h1>{{ $route.params.project }}</h1>
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

    constructor() {
        super();

    }
}
</script>

<style>

</style>
