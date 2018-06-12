<template>
    <div id="logo-animation-container">

    </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import p5 from 'p5';
import p5svg from '../../node_modules/p5.js-svg/dist/p5.svg.js';

@Component({
    components: {

    },
})

// Submenu associated with a unique main menu entry
export default class LogoAnimated extends Vue {
    private p5: p5;

    constructor() {
        super();
    }

    public created() {
        const sketch = (p) => {
            const canvasWidth = 240;
            const canvasHeight = 240;

            // p.preload = () => {
            //
            // };

            p.setup = () => {
                p.createCanvas(canvasWidth, canvasHeight);
            };

            p.draw = () => {
                p.background(255);
                p.fill(255);
                p.stroke(0);
                // p.rect(x / 2, y / 2, 50, 50);
                // console.log(p.frameRate());

                p.push();
                p.translate(p.width * 0.2, p.height * 0.5);
                p.rotate(p.frameCount / 200.0);
                polygon(0, 0, 30, 3);
                p.pop();

                function polygon(x, y, radius, npoints) {
                    const angle = p.TWO_PI / npoints;
                    p.beginShape();
                    p.vertex(42, 48);
                    p.vertex(22, 186);
                    p.vertex(174, 12);
                    p.vertex(260, 192);
                    p.vertex(42, 48);
                    /*
                    for (let a = 0; a < p.TWO_PI; a += angle) {
                        let sx = x + p.cos(a) * radius;
                        let sy = y + p.sin(a) * radius;
                        p.vertex(sx, sy);
                    }
                    */
                    p.endShape(p.CLOSE);
                }

            };
        };

        this.p5 = new p5(sketch, 'logo-animation-container');
        // console.log(this.p5);
    }

    // Emits an open event to the parent
    // @Emit('activateMenu') public activateMenu(item: MenuItem): void {
        /* tslint fix - 'no-empty blocks' */
    // }

}
</script>

<style lang="scss" scoped>
    #logo-animation-container {
        width: 240px;
        height: 240px;
    }

</style>