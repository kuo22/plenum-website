<template>
    <li class="FieldMenuEntry">
        <a><router-link :to="'/project/' + project.url">{{project.title}}</router-link></a>
    </li>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Project from '../interfaces/Project';

@Component
export default class ProjectTextMenuEntry extends Vue {
    @Prop() private project!: Project;
    private active: boolean;

    constructor() {
        super();

        this.active = false;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    a {
        color: black;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }
</style>
