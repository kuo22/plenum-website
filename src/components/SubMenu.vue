<template>
    <div :class="{ active: menu.active }" :id="menu.name.toLowerCase()" :style="{background: menu.color}">
        <ul id="submenu-container" v-for="(subheaders, header) in menu.subMenu">
            <h1 v-if="menu.subMenu">
                {{ header }}
            </h1>
            <li v-for="subheader in subheaders">
                <a v-on:click="activateMenu(menu)">
                    <h2>
                        {{ subheader }}
                    </h2>
                </a>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
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

        // Emits an open event to the parent
        @Emit('activateMenu') public activateMenu(item: MenuItem): void {
            /* tslint fix - 'no-empty blocks' */
        }

    }
</script>

<style lang="scss" scoped>
    $viewAllSubMenus: false;
    $lefterWidth: 240px;

    .active {
        left: 20px;
        z-index: 1;
    }

    .submenu a:hover {
        cursor: pointer;
        text-decoration: underline;
    }

    #submenu-container {
        padding: 15px 15px;
    }

    h1, h2, h3, h4, h5, h6 {
        font-weight: bold;
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