<template>
    <main>
        <div class="error">
            <div class="error__code">
                404
            </div>
            <div>
                go
                <a
                    class="link"
                    @click="goBack()"
                >back</a>
                 or go
                <router-link
                    to="/"
                    class="link"
                >home</router-link>
            </div>
        </div>
    </main>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";

    @Component({
        components: {},
    })

// Description of Vue component
    export default class NotFoundView extends Vue {

        constructor() {
            super();
        }

        // Navigate back one page in URL history
        private goBack() {
            this.$router.go(-1);
        }

    }
</script>

<style lang="scss" scoped>
    .error {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .error > *:not(.error__code) {
        font-size: 3em;
    }

    .error__code {
        font-size: 12em;
    }

    .link {
        text-decoration: underline;
        font-size: 1em;
    }

    .link:hover {
        cursor: pointer;
    }
</style>