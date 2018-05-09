<template>
    <div class="filter-menu">
        <ul id="menu" style="list-style-type:none">
            <li v-for="filter in filters">
                <label class="container">
                    <a>
                        <router-link v-bind:to="'/menu/' + filter.path">{{ filter.path }}</router-link>
                    </a>
                    <input type="checkbox" v-model="filter.checked">
                    <span class="checkmark"></span>
                </label>
            </li>
            <li>
                <a style="margin: 0 0 0 33px">
                    <router-link v-bind:to="'/menu/' + filtersAsParams">check 'em out</router-link>
                </a>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import FilterOption from '@/interfaces/FilterOption';

@Component({
    components: {}, // TODO: turn filter options into components to insert them into pop-up filter menu in visual menu
})

export default class FilterMenu extends Vue {
    @Prop() private filters!: FilterOption[]; // List of filter options

    // Creates Vue instance
    constructor() {
        super();
    }

    // Returns the parameterized whitelist filters
    get filtersAsParams(): string {
        return this.createFiltersAsParams(this.filters);
    }

    // Consolidates the user-selected whitelist filters into a URL-acceptable parameter
    // parameter(s) needed:
    //      filters = list of filter options
    private createFiltersAsParams(filters: FilterOption[]): string {
        let selectedFilterTitles = '';

        filters.forEach((filter: FilterOption) => {
            if (filter.checked) {
                selectedFilterTitles += filter.title + '&';
            }
        });

        selectedFilterTitles = selectedFilterTitles.substr(0, selectedFilterTitles.length - 1);

        return selectedFilterTitles;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .filter-menu {
        width: 300px;
    }
    ul {
        padding: auto;
    }
    li {
        padding: 10px 0;
    }
    a {
        font-family: 'Cousine';
        font-size: 15px;
        padding: 4px 5px;
        text-decoration: none;
        color: black;
        background-color: mistyrose;
    }
    a:hover {
        background-color: transparent;
    }
    /* Customize the label (the container) */
    .container {
        display: block;
        position: relative;
        padding-left: 35px;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    /* Hide the browser's default checkbox */
    .container input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
    }

    /* Create a custom checkbox */
    .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 25px;
        width: 25px;
        background-color: mistyrose;
    }
    /* On mouse-over, add a grey background color */
    .checkmark:hover{
        background-color: #dcc4c1;
    }

    /* When the checkbox is checked, add a blue background */
    .container input:checked ~ .checkmark {
        background-color: mistyrose;
    }

    /* Create the checkmark/indicator (hidden when not checked) */
    .checkmark:after {
        content: "";
        position: absolute;
        display: none;
    }

    /* Show the checkmark when checked */
    .container input:checked ~ .checkmark:after {
        display: block;
    }

    /* Style the checkmark/indicator */
    .container .checkmark:after {
        left: 9px;
        top: 5px;
        width: 5px;
        height: 10px;
        border: solid #404040;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
</style>
