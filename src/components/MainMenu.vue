<template>
    <div id="main-menu">
        <ul id="menu">
            <a v-for="item in menuItems" @mouseenter="updateHoverState(true, item)" @mouseleave="updateHoverState(false, item)">
                <li :style="styleMenuItem(item)" >
                    <h1 v-on:click="open(item)">{{ item.name }}</h1>
                </li>
            </a>
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

export default class MainMenu extends Vue {
    @Prop() private menuItems!: MenuItem[];
    private hoverState: boolean;
    private openedItem: MenuItem;
    private activeMenu: MenuItem;

    constructor() {
        super();

        this.hoverState = false;
    }

    public updateHoverState(isHover: boolean, item: MenuItem) {
        item.hoverState = isHover;
    }

    public styleMenuItem(item: MenuItem): {} {
        let bg = {};

        if (item.hoverState || item.active) {
            bg = { background: 'transparent' };
        } else {
            bg = { background: item.color };
        }

        return bg;
    }

    @Emit('open') public open(item: MenuItem): void {
        // item.active = true;
    }
}
</script>

<style lang="scss" scoped>

    #main-menu {
        padding: 15px;
    }

    li {
        padding: 2px 7px;
        margin: 15px 0px;
        text-align: right;
    }

    li:hover {
        background: transparent;
    }

    a:hover {
        cursor: pointer;
    }

</style>