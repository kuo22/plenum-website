<template>
    <div id="main-menu">
        <ul id="menu">
            <a v-for="item in menuItems">
                <li :style="{background: item.color}">
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
    private openedItem: MenuItem;
    private activeMenu: MenuItem;

    constructor() {
        super();
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

    a:hover {
        cursor: pointer;
    }

</style>