<template>
    <div>
        <svg
            class="logo"
            :class="{'rotating': appLoading}"

            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 55 55"
            enable-background="new 0 0 55 55"
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

                    width="17px"
                    height="17px"
                    x="19"
                    y="18">
                </rect>
            </router-link>
        </svg>
    </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    components: {

    },
    computed: {
        ...mapGetters({
            appLoading: 'appLoading',
        })
    }
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
        position: relative;
        top: 50%;
        transform: translateY(-50%);

        //padding: 20px;

        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .logo .focusable {
        outline: none;
    }

    .logo__rect {
        transform: matrix(0.7071, 0.7071, -0.7071, 0.7071, 26.5161, -10.984);
        fill: transparent;
        stroke: #000000;
        stroke-width: 4px;
        stroke-miterlimit: 10;

        transition: transform 0.5s ease;
    }

    .focusable > .focusable__content {
        width: 17px; // Chrome sizing | Must reflect width in SVG rect
        height: 17px; // Chrome sizing | Must reflect width in SVG rect
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



    @-webkit-keyframes rotating /* Safari and Chrome */ {
        from {
            -webkit-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        to {
            -webkit-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    @keyframes rotating {
        from {
            -ms-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -webkit-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        to {
            -ms-transform: rotate(360deg);
            -moz-transform: rotate(360deg);
            -webkit-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    .rotating {
        position: static;
        -webkit-animation: rotating 2s linear infinite;
        -moz-animation: rotating 2s linear infinite;
        -ms-animation: rotating 2s linear infinite;
        -o-animation: rotating 2s linear infinite;
        animation: rotating 2s linear infinite;
    }
</style>