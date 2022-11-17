<template>
    <div class="view" ref="containerRef"></div>
</template>
<script>
import { initStats } from '@/util';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import { defineComponent, ref } from 'vue';
import { loadGopher } from '@/util';

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
            camera.position.x = -20;
            camera.position.y = 10;
            camera.position.z = 45;
            camera.lookAt(new THREE.Vector3(10, 0, 0));

            this.WebGLRenderer.setClearColor(new THREE.Color(0x000000));
            this.WebGLRenderer.setSize(innerWidth, innerHeight);
            this.WebGLRenderer.shadowMap.enabled = true;
            this.WebGLRenderer.render(this.scene, camera);
            this.containerRef.appendChild(this.WebGLRenderer.domElement);

            const trackballControls = new TrackballControls(camera, this.WebGLRenderer.domElement);
            const clock = new THREE.Clock();

            const groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);
            const groundMesh = new THREE.Mesh(
                groundGeom,
                new THREE.MeshBasicMaterial({
                    color: 0x777777
                })
            );
            groundMesh.rotation.x = -Math.PI / 2;
            groundMesh.position.y = -20;
            this.scene.add(groundMesh);

            const sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
            const cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
            const planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);

            const meshMaterial = new THREE.MeshBasicMaterial({
                color: 0x7777ff,
                name: 'Basic Material',
                flatShading: true
            });

            const sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
            const cube = new THREE.Mesh(cubeGeometry, meshMaterial);
            const plane = new THREE.Mesh(planeGeometry, meshMaterial);

            // position the sphere
            sphere.position.x = 0;
            sphere.position.y = 3;
            sphere.position.z = 2;

            // cube.position = sphere.position;
            // plane.position = sphere.position;

            // add the sphere to the scene
            this.scene.add(cube);

            // position and point the camera to the center of the scene
            camera.position.x = -20;
            camera.position.y = 50;
            camera.position.z = 40;
            camera.lookAt(new THREE.Vector3(10, 0, 0));

            // add subtle ambient lighting
            const ambientLight = new THREE.AmbientLight(0x0c0c0c);
            this.scene.add(ambientLight);

            // add spotlight for the shadows
            const spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(-40, 60, -10);
            spotLight.castShadow = true;
            this.scene.add(spotLight);

            // call the render function
            let step = 0;

            const controls = {
                rotationSpeed: 0.02,
                bouncingSpeed: 0.03,
                color: meshMaterial.color.getStyle(),
                selectedMesh: 'cube'
            };
            let selectedMesh = cube;
            // addBasicMaterialSettings(this.gui, controls, meshMaterial);

            const spGui = this.gui.addFolder('THREE.MeshBasicMaterial');
            spGui.addColor(controls, 'color').onChange(function (e) {
                meshMaterial.color.setStyle(e);
            });
            spGui.add(meshMaterial, 'wireframe');
            spGui.add(meshMaterial, 'wireframeLinewidth', 0, 20);
            spGui.add(meshMaterial, 'wireframeLinejoin', ['round', 'bevel', 'miter']).onChange(function (e) {
                meshMaterial.wireframeLinejoin = e;
            });
            spGui.add(meshMaterial, 'wireframeLinecap', ['butt', 'round', 'square']).onChange(function (e) {
                meshMaterial.wireframeLinecap = e;
            });

            const _this = this;
            loadGopher(meshMaterial).then(function (gopher) {
                gopher.scale.x = 4;
                gopher.scale.y = 4;
                gopher.scale.z = 4;
                _this.gui.add(controls, 'selectedMesh', ['cube', 'sphere', 'plane', 'gopher']).onChange(function (e) {
                    _this.scene.remove(plane);
                    _this.scene.remove(cube);
                    _this.scene.remove(sphere);
                    _this.scene.remove(gopher);

                    switch (e) {
                        case 'cube':
                            _this.scene.add(cube);
                            selectedMesh = cube;
                            break;
                        case 'sphere':
                            _this.scene.add(sphere);
                            selectedMesh = sphere;
                            break;
                        case 'plane':
                            _this.scene.add(plane);
                            selectedMesh = plane;
                            break;
                        case 'gopher':
                            _this.scene.add(gopher);
                            selectedMesh = gopher;
                            break;
                    }
                });
            });

            const renderScene = () => {
                trackballControls.update(clock.getDelta());
                stats.update();

                selectedMesh.rotation.y = step += 0.01;

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
