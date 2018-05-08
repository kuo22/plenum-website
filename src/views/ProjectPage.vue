<template>
  <div class="project">
      <h1>{{ project }}</h1>
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
    @Prop() public project!: string;
    // TODO: figure out how to get project into this view, right now, the Project object stops at MenuEntry(s)

    constructor() {
        super();

    }
}
</script>

<style>

</style>
