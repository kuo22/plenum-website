<template>
  <div class="home">
    <FilterMenu id="filter-menu" :filters="filters"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FilterMenu from '@/components/FilterMenu.vue';
import FilterOption from '../interfaces/FilterOption';
import {ProjectCategory} from '../enums/ProjectCategory';

@Component({
  components: {
    FilterMenu,
  },
})
export default class Home extends Vue {
    private filters: FilterOption[];

    constructor() {
        super();

        this.filters = this.createFilters();
    }

    // Returns the whitelist filter options based on project categories
    private createFilters(): FilterOption[] {
        return [
            new FilterOption(ProjectCategory.ART),
            new FilterOption(ProjectCategory.ARCH),
            new FilterOption(ProjectCategory.GEOG),
            new FilterOption(ProjectCategory.DEV),
            new FilterOption(ProjectCategory.FREELANCE),
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
