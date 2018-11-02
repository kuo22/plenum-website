<template>
    <div>
        <svg
            class="logo"

            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 53.033 53.032"
            enable-background="new 0 0 53.033 53.032"
            xml:space="preserve">
            <router-link
                to="/"
                title="Return to Home"
                tabindex="0"

                class="focusable"

                @click.native="logoLinkActivated"
                @keydown.enter.prevent.native="logoLinkActivated"
            >
                <rect
                    tabindex="-1"
                    class="logo__rect focusable__content"

                    x="11.517"
                    y="11.016">
                </rect>
            </router-link>
        </svg>
    </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';

@Component({
    components: {

    },
})

// The main logo for the site
export default class TheLogo extends Vue {
    constructor() { super(); }

    // Emits click event upon logo link to parent
    @Emit('logoLinkActivated')
    private logoLinkActivated() {}

}
</script>

<style lang="scss" scoped>
    @import '../styles/_settings';

    .logo {
        width: 75px;
        height: 100px;
        transform: translateY(-50%);
        top: 50%;
        position: relative;
    }

    .logo .focusable {
        outline: none;
    }

    .logo__rect {
        transform: matrix(0.7071, 0.7071, -0.7071, 0.7071, 26.5161, -10.984);
        fill: transparent;
        stroke: #000000;
        stroke-width: 7px;
        stroke-miterlimit: 10;
        width: 30px !important;
        height: 31px !important;

        transition: transform 0.5s ease;
    }

    // Override 'focusable' styles
    .logo .focusable:focus > .focusable__content {
        transform: translateY(0px);
        outline: 0 solid transparent;

        transition: transform 0.5s ease;
    }

    .logo .focusable:hover > .focusable__content {
        fill: #000000;
    }
</style>