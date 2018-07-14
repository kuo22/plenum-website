<template>
    <div id="submenu-container">
        <div class="lefter" :class="{ 'submenu-active': menu.active }" :id="menu.name.toLowerCase()" :style="{background: menu.color}">
            <ul id="section-container" v-for="(sectionLinks, sectionName) in menu.subMenu">
                <h1 v-if="menu.subMenu">
                    {{ sectionName }}
                </h1>
                <li v-on:mouseover="submenuLink.hovered = true"
                    v-on:mouseleave="submenuLink.hovered = false"
                    v-for="submenuLink in sectionLinks">
                    <router-link :to="'/' + menu.name.toLowerCase() +
                                      '/' + submenuLink.title.replace(new RegExp(' ', 'g'), '-').toLowerCase() +
                                      '/index'">
                        <a v-on:click="activateSubmenuLink(menu, sectionName, submenuLink)"><!-- TODO Change to 'openSection', within which the menu gets activated-->
                            <h2>
                                {{ submenuLink.title }}
                            </h2>
                        </a>
                    </router-link>
                </li>
            </ul>
        </div>
        <template v-for="sectionLinks in menu.subMenu">
            <transition v-for="submenuLink in sectionLinks" name="component-fade">
                <div v-if="submenuLink.hovered || submenuLink.active" id="submenu-preview-container"
                     :class="{ 'submenu-link-active': submenuLink.active, hovered: submenuLink.hovered }"> <!--   -->
                    <div id="cover" class="preview-half">
                        <div id="cover-image-container">
                            <img :src="submenuLink.coverImageURL">
                        </div>
                    </div>
                    <div id="index" class="preview-half">

                    </div>
                </div>
            </transition>
        </template>
    </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import {MainMenuItem} from '@/classes/MainMenuItem';
import {SubmenuLink} from '../classes/SubmenuLink';

@Component({
    components: {

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

    #cover-image-container {
        width: 100%;
        height: 100%;
        background: transparent;
    }

    #cover-image-container img {
        max-width: 90%;
        max-height: 82vh;
        height: auto;
        transform: translateY(9vh);
        box-shadow: -5px 5px 15px 2px rgba(0, 0, 0, 0.14);
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

    #cover {
        border-right: 3px solid black;
        background: transparent;
    }

    .preview-half {
        display: inline-block;
        height: 100vh;
        width: calc((#{$preview-container} - #{$lefterWidth}) / 2);
        float: left;
    }

    #submenu-preview-container {
        display: inline-block;
        position: absolute;
        left: $lefterWidth;
        top: 0;
        width: $preview-container;
        height: 100vh;
        float: right;
        background: transparent;
        z-index: 2;
    }

    #submenu-preview-container.submenu-link-active {
        display: inline-block;
        width: $preview-container;
        height: 100vh;
        float: right;
        background: transparent;
        z-index: 1;
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

    #submenu-preview-container.hovered {
        z-index: 3;
    }

    .component-fade-enter-active {
        transition: opacity 0.3s ease;
    }

    .component-fade-leave-active {
        transition: opacity 0.5s ease;
    }

    .component-fade-enter-to,
    .component-fade-leave {
        opacity: 1;
    }

    .component-fade-leave-to,
    .component-fade-enter {
        opacity: 0;
    }
</style>