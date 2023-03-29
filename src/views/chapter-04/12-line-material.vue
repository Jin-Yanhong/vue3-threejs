<template>
    <div class="view" ref="containerRef"></div>
</template>
<script>
import { initStats } from '@/three.util';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import { defineComponent, ref } from 'vue';
import { windowSize } from '@/utils/constant';
export default defineComponent({
    setup() {
        const containerRef = ref();
        const scene = new THREE.Scene();
        const WebGLRenderer = new THREE.WebGLRenderer();
        const gui = new dat.GUI();

        return {
            containerRef,
            scene,
            WebGLRenderer,
            gui
        };
    },
    mounted() {
        this.init();
    },
    beforeUnmount() {
        this.depose();
    },
    methods: {
        init() {
            const stats = initStats();

            const innerWidth = windowSize.innerWidth;
            const innerHeight = windowSize.innerHeight;

            const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
            camera.position.x = -20;
            camera.position.y = 10;
            camera.position.z = 45;
            camera.lookAt(this.scene.position);

            this.WebGLRenderer.setClearColor(new THREE.Color(0x000000));
            this.WebGLRenderer.setSize(innerWidth, innerHeight);
            this.WebGLRenderer.shadowMap.enabled = true;
            this.WebGLRenderer.render(this.scene, camera);
            this.containerRef.appendChild(this.WebGLRenderer.domElement);
            const trackballControls = new TrackballControls(camera, this.WebGLRenderer.domElement);
            const clock = new THREE.Clock();

            const renderScene = () => {
                trackballControls.update(clock.getDelta());
                stats.update();

                requestAnimationFrame(renderScene);
                this.WebGLRenderer.render(this.scene, camera);
            };
            renderScene();
        },
        gosper(a, b) {
            const turtle = [0, 0, 0];
            const points = [];
            const count = 0;
            function rt(x) {
                turtle[2] += x;
            }

            function lt(x) {
                turtle[2] -= x;
            }

            function fd(dist) {
                points.push({
                    x: turtle[0],
                    y: turtle[1],
                    z: Math.sin(count) * 5
                });

                const dir = turtle[2] * (Math.PI / 180);
                turtle[0] += Math.cos(dir) * dist;
                turtle[1] += Math.sin(dir) * dist;

                points.push({
                    x: turtle[0],
                    y: turtle[1],
                    z: Math.sin(count) * 5
                });
            }

            function rg(st, ln, turtle) {
                st--;
                ln = ln / 2.6457;
                if (st > 0) {
                    rg(st, ln, turtle);
                    rt(60);
                    gl(st, ln, turtle);
                    rt(120);
                    gl(st, ln, turtle);
                    lt(60);
                    rg(st, ln, turtle);
                    lt(120);
                    rg(st, ln, turtle);
                    rg(st, ln, turtle);
                    lt(60);
                    gl(st, ln, turtle);
                    rt(60);
                }
                if (st == 0) {
                    fd(ln);
                    rt(60);
                    fd(ln);
                    rt(120);
                    fd(ln);
                    lt(60);
                    fd(ln);
                    lt(120);
                    fd(ln);
                    fd(ln);
                    lt(60);
                    fd(ln);
                    rt(60);
                }
            }

            function gl(st, ln, turtle) {
                st--;
                ln = ln / 2.6457;
                if (st > 0) {
                    lt(60);
                    rg(st, ln, turtle);
                    rt(60);
                    gl(st, ln, turtle);
                    gl(st, ln, turtle);
                    rt(120);
                    gl(st, ln, turtle);
                    rt(60);
                    rg(st, ln, turtle);
                    lt(120);
                    rg(st, ln, turtle);
                    lt(60);
                    gl(st, ln, turtle);
                }
                if (st == 0) {
                    lt(60);
                    fd(ln);
                    rt(60);
                    fd(ln);
                    fd(ln);
                    rt(120);
                    fd(ln);
                    rt(60);
                    fd(ln);
                    lt(120);
                    fd(ln);
                    lt(60);
                    fd(ln);
                }
            }
            rg(a, b, turtle);

            return points;
        },
        depose() {
            this.WebGLRenderer.dispose();
            this.gui.destroy();
            const panelGroup = document.querySelector('#panelGroup');
            document.querySelector('[class=\'view\']').removeChild(panelGroup);
        }
    }
});
</script>
