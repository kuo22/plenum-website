<template>
    <router-link
        to="/"
        title="Return to Home"
        tabindex="0"

        class="logo-keyframe"

        @click.native="logoClicked"
    >
        <div
            id="logo"
            class="logo"
            tabindex="-1"
        >
        </div>
    </router-link>
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
export default class TheLogo extends Vue {
    @Prop() private playLogo!: boolean;
    @Prop() private dimension!: number;
    private p5: p5;

    constructor() { super(); }

    @Emit('logoClicked')
    private logoClicked(): void {
        // Filler
    }

    // When this component is loaded, draw a canvas with an animated Plenum logo
    private created() {
        this.p5 = new p5(this.logoSketch(1.0, 2.0), 'logo');
    }

    // TODO: Clean up variable naming and modularize main processes
    // The p5 Processing Sketch of the animated logo
    // parameter(s) needed:
    //      animationSpeed  = the velocity of the animation
    //      transitionSpeed = the acceleration rate of the logo's animation
    //                        100 must be divisible by the provided number
    private logoSketch(animationSpeed: number, transitionSpeed: number): any {
        let sketch;
        const rotateSquare = false; // whether to rotate the thick square
        const fadeActive = false; // whether the polygons fade in and out

        try {
            if (100 % transitionSpeed !== 0) {
                this._throw('The maximum value, 100, must be divisible by the transition speed.');
            } else {
                sketch = (p) => {
                    let canvasWidth = this.dimension;
                    let canvasHeight = this.dimension;

                    const keyframeIncrement = animationSpeed; // Velocity of animation
                    let keyframe = Math.floor(Math.random() * 200) + 1; // Random start position in time for animation

                    const degreesIncrement = transitionSpeed; // Velocity of transition MAX = 100
                    let degrees = 0;

                    let logoTextImage;

                    // p5 Preload:
                    // - Logo text image
                    p.preload = () => {
                        const textLogoSrcMethod = require.context('../assets/logo/', false, /\.png$/);
                        const textLogoSrc = textLogoSrcMethod('./nameLogo.png');
                        logoTextImage = p.loadImage(textLogoSrc);
                    };

                    // p5 Setup:
                    // - Create canvas
                    p.setup = () => {
                        p.createCanvas(canvasWidth, canvasHeight);
                    };

                    // p5 drawing loop
                    p.draw = () => {
                        p.background(255);
                        p.noFill();

                        fadeTextImage(p.map(degrees, 0, 100, 0, 255));
                        rotatePolygons(keyframe, rotateSquare, fadeActive);

                        // Logic for accelerated movement
                        // Update keyframe position and position along degrees
                        if (this.playLogo && degrees !== 100) {
                            // if transitionPos hasn't reached its end, ie the transition has not played
                            const x = p.map(degrees, 0, 100, Math.PI / 2.0, 0);
                            const ratio = Number.parseFloat(Math.cos(x)).toFixed(15);
                            keyframe += p.map(ratio, 0, 1, 0, keyframeIncrement);

                            degrees += degreesIncrement;
                        } else if (!this.playLogo && degrees !== 0) {
                            // if transitionPos hasn't returned to original value, ie transition is
                            const x = p.map(degrees, 100, 0, 0, Math.PI / 2.0);
                            const ratio = Number.parseFloat(Math.cos(x)).toFixed(15);
                            keyframe += p.map(ratio, 0, 1, 0, keyframeIncrement);

                            degrees -= degreesIncrement;
                        } else if (this.playLogo) {
                            keyframe += keyframeIncrement;
                        }

                        // Rotate the polygons based on the the provided keyframe position
                        // parameter(s) needed:
                        //      keyframe = current frame of the animation
                        //      rotateSquare = whether or not the large bold square rotates
                        function rotatePolygons(keyframe: number, rotateSquare: boolean, fadeActive: boolean) {
                            let numPolys = 4; // Standard 4
                            for (let i = 0; i < numPolys; i++) {
                                p.push();
                                p.translate(p.width / 2, p.height / 2);

                                if (i === 0 && rotateSquare !== true) { //
                                    p.rotate(0);
                                } else if (i % 2 === 0) {
                                    p.rotate(-keyframe / (i * 50.0 + 100.0));
                                    // TODO: use direction variable to reduce redundancy in formulas or variablize the formula
                                } else {
                                    p.rotate(keyframe / (i * 50.0 + 100.0));
                                }

                                polygon(0, 0, 100 - i * 5.0, i + 4, keyframe, fadeActive);
                                p.pop();
                            }
                        }

                        // Returns a regular polygon of a specific size, location, and specific number of points
                        // parameter(s) needed:
                        //      x       = x-coordinate
                        //      y       = y-coordinate
                        //      radius  = radius of a polygon's circumcircle
                        //      npoints = number of points on the polygon
                        function polygon(x, y, radius, npoints, keyframe, fadeActive) {
                            const grad = p.lerpColor(p.color(218, 165, 32), p.color(0), 1.0);
                            const angle = p.TWO_PI / npoints;
                            //p.stroke(p.lerpColor(p.color(0), p.color(255), 0));
                            p.beginShape();
                            p.strokeWeight(20.0 / (npoints * (0.4 * npoints)));

                            for (let a = 0; a < p.TWO_PI; a += angle) {
                                const sx = x + p.cos(a) * radius;
                                const sy = y + p.sin(a) * radius;
                                if (fadeActive) {
                                    let speed;
                                    let step;
                                    let fade = 1;
                                    switch (npoints) {
                                        case 5:
                                        case 8:
                                            speed = 360;
                                            step = (keyframe - npoints) % speed;
                                            if (step < speed / 2) {
                                                p.stroke(p.lerpColor(p.color(0), p.color(255), p.map(step, 0, speed / 2, 0, 1)));
                                            } else {
                                                p.stroke(p.lerpColor(p.color(0), p.color(255), p.map(step, speed / 2, speed, 1, 0)));
                                            }
                                            break;
                                        case 6:
                                        case 9:
                                            speed = 240;
                                            step = (keyframe - npoints) % speed;
                                            if (step < speed / 2) {
                                                p.stroke(p.lerpColor(p.color(0), p.color(255), p.map(step, 0, speed / 2, 0, 1)));
                                            } else {
                                                p.stroke(p.lerpColor(p.color(0), p.color(255), p.map(step, speed / 2, speed, 1, 0)));
                                            }
                                            break;
                                        case 7:
                                        case 10:
                                            speed = 180;
                                            step = (keyframe - npoints) % speed;
                                            if (step < speed / 2) {
                                                p.stroke(p.lerpColor(p.color(0), p.color(255), p.map(step, 0, speed / 2, 0, 1)));
                                            } else {
                                                p.stroke(p.lerpColor(p.color(0), p.color(255), p.map(step, speed / 2, speed, 1, 0)));
                                            }
                                            break;
                                    }
                                }
                                p.vertex(sx, sy);
                            }

                            p.endShape(p.CLOSE);
                        }

                        //
                        function fadeTextImage(alpha: number) {
                            p.image(logoTextImage, 0, 0, canvasWidth, canvasHeight);
                            p.tint(255, alpha);
                        }
                    };
                };
            }
        } catch (e) {
            console.error("Error: " + e);
        }

        return sketch;
    }

    // Throws an error with the provided message
    // parameter
    //      message = the messaged attached to the thrown error
    private _throw(message: string) {
        throw message;
    }
}
</script>

<style lang="scss" scoped>
    .logo {
        position: relative;
        width: inherit;
        height: inherit;
    }

    .logo-keyframe {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .logo-keyframe:focus > .logo {
        outline: 3px dashed white;
    }

    .logo-keyframe:focus,
    .logo:focus {
        outline: none;
    }
</style>