<template>
    <a v-on:click="play = !play">
        <div id="logo-animation-container">

        </div>
    </a>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import p5 from 'p5';

@Component({
    components: {

    },
})

// Submenu associated with a unique main menu entry
export default class LogoAnimated extends Vue {
    private p5: p5;
    @Prop() private play: boolean = false;
    private frame: number = Math.floor(Math.random() * 200) + 1;

    constructor() {
        super();
    }

    // When this component is loaded, draw a canvas with an animatable Plenum logo
    public created() {
        const sketch = (p) => {
            const canvasWidth = 240;
            const canvasHeight = 240;

            // p5 canvas setup
            p.setup = () => {
                p.createCanvas(canvasWidth, canvasHeight);
            };

            // p5 drawing loop
            p.draw = () => {
                p.background(255);
                p.noFill();

                const animPos = this.frame; // linear position of the animation

                const rotateSquare = false; // whether to rotate the thick square

                for (let i = 0; i < 4; i++) {
                    p.push();
                    p.translate(p.width / 2, p.height / 2);


                    if (i === 0 && rotateSquare !== true) {
                        p.rotate(0);
                    } else if (i % 2 === 0) {
                        p.rotate(-animPos / (i * 50.0 + 100.0));
                    } else {
                        p.rotate(animPos / (i * 50.0 + 100.0));
                    }


                    polygon(0, 0, 100 - i * 5.0, i + 4);
                    p.pop();
                }

                if (this.play) {
                    this.frame++;
                }

                // Returns a regular polygon of a specific size, location, and specific number of points
                // parameter(s) needed:
                //      x       = x-coordinate
                //      y       = y-coordinate
                //      radius  = radius of a polygon's circumcircle
                //      npoints = number of points on the polygon
                function polygon(x, y, radius, npoints) {
                    const angle = p.TWO_PI / npoints;
                    p.beginShape();
                    p.strokeWeight(20.0 / (npoints * (0.5 * npoints)));
                    p.stroke((npoints / 4.0) * 40.0 - 40.0);

                    for (let a = 0; a < p.TWO_PI; a += angle) {
                        const sx = x + p.cos(a) * radius;
                        const sy = y + p.sin(a) * radius;
                        p.vertex(sx, sy);
                    }

                    p.endShape(p.CLOSE);
                }
            };
        };

        this.p5 = new p5(sketch, 'logo-animation-container');
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