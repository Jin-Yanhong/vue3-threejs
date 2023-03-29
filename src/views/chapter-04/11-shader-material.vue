<template>
    <div class="view" ref="containerRef"></div>
</template>
<script>
import { initStats } from '@/three.util';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import { defineComponent, ref } from 'vue';
import { vertexShader, fragmentShader1, fragmentShader2, fragmentShader3, fragmentShader4, fragmentShader5, fragmentShader6 } from '@/assets/fragmentShader';
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
            gui,
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

            const cubeGeometry = new THREE.BoxGeometry(20, 20, 20);

            const meshMaterial1 = this.createMaterial(vertexShader, fragmentShader1);
            const meshMaterial2 = this.createMaterial(vertexShader, fragmentShader2);
            const meshMaterial3 = this.createMaterial(vertexShader, fragmentShader3);
            const meshMaterial4 = this.createMaterial(vertexShader, fragmentShader4);
            const meshMaterial5 = this.createMaterial(vertexShader, fragmentShader5);
            const meshMaterial6 = this.createMaterial(vertexShader, fragmentShader6);

            const material = [meshMaterial1, meshMaterial2, meshMaterial3, meshMaterial4, meshMaterial5, meshMaterial6];

            const cube = new THREE.Mesh(cubeGeometry, material);
            this.scene.add(cube);

            const ambientLight = new THREE.AmbientLight(0x0c0c0c);
            this.scene.add(ambientLight);

            // add spotlight for the shadows
            const spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(-40, 60, -10);
            spotLight.castShadow = true;
            this.scene.add(spotLight);

            let step = 0;

            const renderScene = () => {
                trackballControls.update(clock.getDelta());
                stats.update();

                cube.rotation.y = step += 0.01;
                cube.rotation.x = step;
                cube.rotation.z = step;

                cube.material.forEach(function (e) {
                    e.uniforms.time.value += 0.01;
                });

                requestAnimationFrame(renderScene);
                this.WebGLRenderer.render(this.scene, camera);
            };
            renderScene();
        },
        depose() {
            this.WebGLRenderer.dispose();
            this.gui.destroy();
            const panelGroup = document.querySelector('#panelGroup');
            document.querySelector("[class='view']").removeChild(panelGroup);
        },
        createMaterial(vertexShader, fragmentShader) {
            const uniforms = {
                time: {
                    type: 'f',
                    value: 0.2,
                },
                scale: {
                    type: 'f',
                    value: 0.2,
                },
                alpha: {
                    type: 'f',
                    value: 0.6,
                },
                resolution: {
                    type: 'v2',
                    value: new THREE.Vector2(),
                },
            };

            uniforms.resolution.value.x = window.innerWidth;
            uniforms.resolution.value.y = window.innerHeight;

            const meshMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                transparent: true,
            });

            return meshMaterial;
        },
    },
});
</script>
