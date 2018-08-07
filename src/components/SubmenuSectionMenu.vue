<template>
        <!--submenu-section-menu></submenu-section-menu--><!-- CREATE A UNIVERSAL CLASS THAT MANAGES FOCUS WITHIN COMPONENTS-->
        <nav :title="menuTitle + ' Content Navigation Menu'"
             :aria-labelledby="menuTitle"
             role="navigation">
            <label :v-if="this.parentMenu.subMenu"
                   class="section-label"
                   :id="menuTitle">
                {{ menuTitle }}
            </label>
            <ul :aria-labelledby="menuTitle"
                class="section-container"
                role="menu">
                <li class="menu-button"
                    v-for="(menuLink, key) in menuItems"
                    v-on:mouseover="menuLink.hovered = true"
                    v-on:mouseleave="menuLink.hovered = false">
                    <router-link :to="'/' + parentMenu.name.toLowerCase() +
                                      '/' + menuLink.title.replace(new RegExp(' ', 'g'), '-').toLowerCase() +
                                      '/index'"
                                 @click.native="activateSubmenuLink(parentMenu, menuTitle, menuLink)"
                                 :class="{ underlined: menuLink.active }"
                                 :tabindex="key === 0 ? '0' : '-1'"
                                 role="menuitem"
                                 aria-haspopup="true"
                                 :aria-expanded="menuLink.active ? 'true' : 'false'">
                        <span class="menu-button-content" tabindex="-1">{{ menuLink.title }}</span>
                    </router-link>
                </li>
            </ul>
        </nav>
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
    export default class SubmenuSectionMenu extends Vue {
        @Prop() private menuItems!: SubmenuLink[]; // Parent sectionMenu item
        @Prop() private menuTitle!: string;
        @Prop() private parentMenu: MainMenuItem;
        @Prop() private menuItemHovered: boolean;
        @Prop() private previewImageURL: string = '';

        constructor() {
            super();
        }

        @Emit('activateSubmenuLink')
        public activateSubmenuLink(item: MainMenuItem,
                                   menuTitle: string,
                                   menuLink: SubmenuLink) {
            // Filler
        }
    }
</script>

<style lang="scss" scoped>
    $viewAllSubMenus: false;
    $lefterWidth: 240px;
    $preview-container: calc(100vw - #{$lefterWidth});

    // TODO: clean up unnecessary css leftover from SubMenu component as template
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

    }

    nav {
        padding: 15px 15px;
        font-weight: bold;
        text-align: right;
        font-size: 1.4em;
    }

    .section-label {
        text-align: left;
        font-size: 1.3em;
        margin-bottom: 0.3em;
        display: block;
    }

    .section-container li {
        height: 40px;
    }

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