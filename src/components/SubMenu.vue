<template>
    <div class="lefter submenu" :id="menu.name.toLowerCase()" :style="{background: menu.color}">
        <ul v-for="header in menu.subMenu">
            {{ header }}
            <li v-for="subheader in header">
                <a>
                    <h2>{{ subheader }}</h2>
                </a>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import {MenuItem} from '@/classes/MenuItem';


    @Component({
        components: {

        },
    })
    export default class SubMenu extends Vue {
        @Prop() private menu!: MenuItem;

        constructor() {
            super();


        }

    }
</script>

<style lang="scss" scoped>
    $lefterWidth: 240px;

    .submenu {
        z-index: 1;
    }

    .submenu a:hover {
        cursor: pointer;
    }

    #about {
        left: $lefterWidth;
    }

    #publications {
        left: 480px;
    }

</style>