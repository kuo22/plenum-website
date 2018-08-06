<template>
    <div>
        <div class="lefter"
             :class="{ 'submenu-active': menu.active }"
             :id="menu.name.toLowerCase()"
             :style="{background: menu.color}">

            <nav v-for="(sectionLinks, sectionName) in menu.subMenu"
                 :title="sectionName + ' Content Navigation Menu'"
                 :aria-label="sectionName + ' Content Menu'"
                 role="navigation">
                <ul :aria-label="sectionName + ' Content Menu'"
                    class="section-container"
                    role="menu">
                    <li v-if="menu.subMenu">
                        {{ sectionName }}
                    </li>
                    <li class="menu-button"
                        v-on:mouseover="submenuLink.hovered = true"
                        v-on:mouseleave="submenuLink.hovered = false"
                        v-for="submenuLink in sectionLinks">
                        <router-link :to="'/' + menu.name.toLowerCase() +
                                          '/' + submenuLink.title.replace(new RegExp(' ', 'g'), '-').toLowerCase() +
                                          '/index'"
                                     @click.native="activateSubmenuLink(menu, sectionName, submenuLink)"
                                     :class="{ underlined: submenuLink.active }"
                                     role="menuitem"
                                     aria-haspopup="true"
                                     :aria-expanded="submenuLink.active ? 'true' : 'false'">
                            <span class="menu-button-content" tabindex="-1">{{ submenuLink.title }}</span>
                        </router-link>
                    </li>
                </ul>
            </nav>
        </div>

        <submenu-item-preview
                v-bind:menu="menu"
                v-on:toggleOpen="toggleOpen"></submenu-item-preview>
    </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import {MainMenuItem} from '@/classes/MainMenuItem';
import {SubmenuLink} from '../classes/SubmenuLink';
import ArticlePreview from '@/components/ArticlePreview';
import SubmenuItemPreview from '@/components/SubmenuItemPreview';

@Component({
    components: {
        ArticlePreview,
        SubmenuItemPreview,
    },
})

// Submenu associated with a unique main menu entry
export default class SubMenu extends Vue {
    @Prop() private menu!: MainMenuItem; // Parent menu item
    @Prop() private menuItemHovered: boolean;
    @Prop() private previewImageURL: string = '';

    constructor() {
        super();
    }

    // Emits an open event to the parent
    @Emit('activateMenu')
    public activateMenu(item: MainMenuItem): void {
        /* tslint fix - 'no-empty blocks' */
    }

    @Emit('toggleOpen')
    public toggleOpen(menu: MainMenuItem): void {
        // Filler
    }

    // Activates the submenu link and emits an event announcing the submenu's use/ activation
    // parameter(s) needed:
    //      item        = main menu item to which this submenu belongs
    //      sectionName = name of the submenu section of the activated submenu link
    //      submenuLink = the submenu link to be activated
    private activateSubmenuLink(item: MainMenuItem,
                                sectionName: string,
                                submenuLink: SubmenuLink) {

        // Deactivate all other submenu links, besides the submenu link to be activated
        for (let i = 0; i < this.menu.subMenu[sectionName].length; i++) {
            const menuItem: SubmenuLink = this.menu.subMenu[sectionName][i];
            if (menuItem.title !== submenuLink.title) {
                this.menu.subMenu[sectionName][i].active = false;
            }
        }

        // If submenu link is already active, turn it off, otherwise activate menu
        if (submenuLink.active) {
            submenuLink.active = false;
        } else {
            this.activateMenu(item);
            submenuLink.active = true;
        }

    }
}
</script>

<style lang="scss" scoped>
    $viewAllSubMenus: false;
    $lefterWidth: 240px;
    $preview-container: calc(100vw - #{$lefterWidth});

    .menu-button-content {
        padding: 8px 5px 0 0;
    }

    a {
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    .submenu-active {
        // left: 20px;
        z-index: 4;
    }

    .submenu a:hover {
        cursor: pointer;
        text-decoration: underline;
    }

    .preview-half {
        position: relative;
        display: inline-block;
        height: 100vh;
        width: calc((#{$preview-container} - #{$lefterWidth}) / 2);
        float: left;
        background: white;
    }

    h2, h3, h4, h5, h6 {
        font-weight: bold;
    }

    .section-container {
        padding: 15px 15px;
        font-weight: bold;
        text-align: right;
        font-size: 1.4em;
    }

    .section-container li:nth-child(1) {
        text-align: left;
        font-size: 1.3em;
        margin-bottom: 0.3em;
    }

    .section-container li {
        height: 40px;
    }

    /*.section-container li:focus-within {*/
        /*outline: 3px dashed black;*/
    /*}*/

    .section-container li:focus {
        outline: none;
    }

    .section-container li a {
        text-align: right;
        display: block;
    }

    .section-container li a:focus {
        outline: none;
    }

    h2 {
        text-align: right;
    }

    .underlined {
        text-decoration: underline;
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