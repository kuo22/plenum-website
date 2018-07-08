<template>
    <div :class="{ active: menu.active }" :id="menu.name.toLowerCase()" :style="{background: menu.color}">
        <ul id="section-container" v-for="(sectionLinks, sectionName) in menu.subMenu">
            <h1 v-if="menu.subMenu">
                {{ sectionName }}
            </h1>
            <li v-for="menuLink in sectionLinks">
                <router-link :to="'/' + menu.name.toLowerCase() +
                                  '/' + menuLink.text.replace(new RegExp(' ', 'g'), '-').toLowerCase() +
                                  '/index'">
                    <a v-on:click="activateMenu(menu)"><!-- TODO Change to 'openSection', within which the menu gets activated-->
                        <h2>
                            {{ menuLink.text }}
                        </h2>
                    </a>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import {MainMenuItem} from '@/classes/MainMenuItem';

    @Component({
        components: {

        },
    })

    // Submenu associated with a unique main menu entry
    export default class SubMenu extends Vue {
        @Prop() private menu!: MainMenuItem; // Parent menu item

        constructor() {
            super();
        }

        // Emits an open event to the parent
        @Emit('activateMenu') public activateMenu(item: MainMenuItem): void {
            /* tslint fix - 'no-empty blocks' */
        }

    }
</script>

<style lang="scss" scoped>
    $viewAllSubMenus: false;
    $lefterWidth: 240px;

    a {
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    .active {
        left: 20px;
        z-index: 1;
    }

    .submenu a:hover {
        cursor: pointer;
        text-decoration: underline;
    }

    #section-container {
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