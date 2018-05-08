<template>
  <div class="home">
    <FilterMenu id="filter-menu" v-bind:filters="filters"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FilterMenu from '@/components/FilterMenu.vue'; // @ is an alias to /src
import Filter from '../interfaces/Filter';

@Component({
  components: {
    FilterMenu,
  },
})
export default class Home extends Vue {
    private filters: Filter[];

    constructor() {
        super();

        this.filters = this.createFilters();
    }

    private createFilters(): Filter[] {
        return [
            new Filter('art'),
            new Filter('architecture'),
            new Filter('geography'),
            new Filter('freelance'),
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
