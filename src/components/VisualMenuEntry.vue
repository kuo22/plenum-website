<template>
    <li class="VisualMenuEntry">
        <a>
            <router-link :to="'/project/' + project.url">
                <img :src="getImgSrc()" v-bind:alt="project.title">
            </router-link>
        </a>
    </li>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Project from '../interfaces/Project';

@Component
export default class VisualMenuEntry extends Vue {
    @Prop() private project!: Project;
    private active: boolean;
    private imgSrc: string;

    constructor() {
        super();

        this.active = false;
        this.imgSrc = '../assets/' + this.project.pathName + '_index_rect_640.jpg';
        this.imgSrc = '../assets/logo.svg';
    }

    public getImgSrc(): string {
        return require('../assets/' + this.project.pathName + '_index_rect_640.jpg');
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    img {
        width: 250px;
    }

    a {

    }

    a:hover {

    }
</style>
