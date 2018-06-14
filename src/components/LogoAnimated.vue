<template>
    <a>
        <router-link to="/">
            <div id="logo-animation-container"></div>
        </router-link>
    </a>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import p5 from 'p5';
import {error} from 'util';

@Component({
    components: {

    },
})

// Submenu associated with a unique main menu entry
export default class LogoAnimated extends Vue {
    private p5: p5;
    @Prop() private playLogo: boolean;

    constructor() {
        super();
    }

    // When this component is loaded, draw a canvas with an animatable Plenum logo
    public created() {
        this.p5 = new p5(this.logoSketch(1.0, 2.0), 'logo-animation-container');
    }

    public logoSketch(animationSpeed: number, transitionSpeed: number): any {
        let sketch;
        if (180 % transitionSpeed === 0) {
            sketch = (p) => {
                const canvasWidth = 240;
                const canvasHeight = 240;

                // TODO make tweak variables as parameters called from the component
                let frame = Math.floor(Math.random() * 200) + 1; // Position in time for animation
                const frameIncrement = animationSpeed; // Velocity of animation

                let degrees = 0;
                // TODO better implement a rational number besides 180, number is arbitrary now
                const degreesIncrement = transitionSpeed; // Velocity of transition MAX = 180



                // p5 canvas setup
                p.setup = () => {
                    p.createCanvas(canvasWidth, canvasHeight);
                };

                // p5 drawing loop
                p.draw = () => {
                    p.background(255);
                    p.noFill();

                    const animPos = frame; // linear position of the animation

                    const rotateSquare = false; // whether to rotate the thick square

                    for (let i = 0; i < 4; i++) {
                        p.push();
                        p.translate(p.width / 2, p.height / 2);


                        if (i === 0 && rotateSquare !== true) {
                            p.rotate(0);
                        } else if (i % 2 === 0) {
                            p.rotate(-animPos / (i * 50.0 + 100.0));
                            // TODO: use direction variable to reduce redundancy in formulas or variablize the formula
                        } else {
                            p.rotate(animPos / (i * 50.0 + 100.0));
                        }


                        polygon(0, 0, 100 - i * 5.0, i + 4);
                        p.pop();
                    }



                    if (this.playLogo && degrees !== 180) {
                        // if transitionPos hasn't reached its end, ie the transition has not played
                        const x = p.map(degrees, 0, 180, Math.PI / 2.0, 0);
                        const ratio = Number.parseFloat(Math.cos(x)).toFixed(15);
                        frame += p.map(ratio, 0, 1, 0, frameIncrement);

                        degrees += degreesIncrement;
                    } else if (!this.playLogo && degrees !== 0) {
                        // if transitionPos hasn't returned to original value, ie transition is
                        const x = p.map(degrees, 180, 0, 0, Math.PI / 2.0);
                        const ratio = Number.parseFloat(Math.cos(x)).toFixed(15);
                        frame += p.map(ratio, 0, 1, 0, frameIncrement);

                        degrees -= degreesIncrement;
                    } else if (this.playLogo) {
                        frame += frameIncrement;
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
        } else {
            error('The maximum value, 180, must be divisible by the transition speed.');
        }

        return sketch;
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