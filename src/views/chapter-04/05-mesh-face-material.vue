<template>
    <div class="view" ref="containerRef"></div>
</template>
<script>
import { initStats } from '@/util';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import { defineComponent, ref } from 'vue';

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

            const innerWidth = window.innerWidth - 300;
            const innerHeight = window.innerHeight;

            const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
            camera.position.set(-20, 30, 40);
            camera.lookAt(this.scene.position);

            this.WebGLRenderer.setClearColor(new THREE.Color(0x000000));
            this.WebGLRenderer.setSize(innerWidth, innerHeight);
            this.WebGLRenderer.render(this.scene, camera);
            this.containerRef.appendChild(this.WebGLRenderer.domElement);
            const trackballControls = new TrackballControls(camera, this.WebGLRenderer.domElement);
            const clock = new THREE.Clock();

            const spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(-40, 60, -10);
            spotLight.castShadow = true;
            this.scene.add(spotLight);

            const group = new THREE.Mesh();
            // add all the rubik cube elements
            const mats = [];
            mats.push(
                new THREE.MeshBasicMaterial({
                    color: 0x009e60
                })
            );

            mats.push(
                new THREE.MeshBasicMaterial({
                    color: 0x0051ba
                })
            );

            mats.push(
                new THREE.MeshBasicMaterial({
                    color: 0xffd500
                })
            );

            mats.push(
                new THREE.MeshBasicMaterial({
                    color: 0xff5800
                })
            );

            mats.push(
                new THREE.MeshBasicMaterial({
                    color: 0xc41e3a
                })
            );

            mats.push(
                new THREE.MeshBasicMaterial({
                    color: 0xffffff
                })
            );

            for (let x = 0; x < 3; x++) {
                for (let y = 0; y < 3; y++) {
                    for (let z = 0; z < 3; z++) {
                        const cubeGeom = new THREE.BoxGeometry(2.9, 2.9, 2.9);
                        const cube = new THREE.Mesh(cubeGeom, mats);
                        cube.position.set(x * 3 - 3, y * 3 - 3, z * 3 - 3);

                        group.add(cube);
                    }
                }
            }

            group.scale.copy(new THREE.Vector3(2, 2, 2));

            this.scene.add(group);
            let step = 0;
            const _this = this;

            const controls = {
                rotationSpeed: 0.01,
                numberOfObjects: _this.scene.children.length
            };

            this.gui.add(controls, 'rotationSpeed', 0, 0.5);

            const renderScene = () => {
                trackballControls.update(clock.getDelta());
                stats.update();

                group.rotation.y = step += controls.rotationSpeed;
                group.rotation.z = step -= controls.rotationSpeed;
                group.rotation.x = step += controls.rotationSpeed;

                requestAnimationFrame(renderScene);
                this.WebGLRenderer.render(this.scene, camera);
            };
            renderScene();
        },
        depose() {
            this.WebGLRenderer.dispose();
            this.gui.destroy();
            const panelGroup = document.querySelector('#panelGroup');
            document.body.removeChild(panelGroup);
        }
    }
});
</script>
