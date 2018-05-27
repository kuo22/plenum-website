<template>
    <div class="lefter submenu" :id="menu.name.toLowerCase()" :style="{background: menu.color}">
        <ul id="submenu-container" v-for="(subheaders, header) in menu.subMenu">
            <h1 v-if="menu.subMenu">
                {{ header }}
            </h1>
            <li v-for="subheader in subheaders">
                <a>
                    <h2>
                        {{ subheader }}
                    </h2>
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

    // Submenu associated with a unique main menu entry
    export default class SubMenu extends Vue {
        @Prop() private menu!: MenuItem; // Parent menu item

        constructor() {
            super();
        }

    }
</script>

<style lang="scss" scoped>
    $viewAllSubMenus: false;
    $lefterWidth: 240px;

    .submenu {
        left: $lefterWidth;
    }

    .submenu a:hover {
        cursor: pointer;
        text-decoration: underline;
    }

    #submenu-container {
        padding: 15px 15px;
    }

    h1 {
        text-align: left;
        padding-bottom: 15px;
    }

    h2 {
        text-align: right;
        margin-bottom: 6px;
        padding: 2px;
    }

    @if $viewAllSubMenus {
        #about, #publications, #contribute, #volunteer {
            display: block !important;
        }

        #about {
            left: $lefterWidth;
        }

        #publications {
            left: 480px;
        }

        #contribute {
            left: 720px;
        }

        #volunteer {
            left: 960px;
        }
    }
</style>