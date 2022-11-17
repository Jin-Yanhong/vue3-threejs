<template>
    <div class="view" ref="containerRef"></div>
</template>
<script>
import { initStats } from '@/util';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import { loadGopher } from '@/util';
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
            camera.lookAt(new THREE.Vector3(10, 0, 0));

            this.WebGLRenderer.setClearColor(new THREE.Color(0xcccccc));
            this.WebGLRenderer.setSize(innerWidth, innerHeight);
            this.WebGLRenderer.render(this.scene, camera);

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

            const meshMaterial = new THREE.MeshNormalMaterial();
            const sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
            const cube = new THREE.Mesh(cubeGeometry, meshMaterial);
            const plane = new THREE.Mesh(planeGeometry, meshMaterial);

            const selectedMesh = cube;

            // position the sphere
            sphere.position.x = 0;
            sphere.position.y = 3;
            sphere.position.z = 2;

            // TODO: TypeError: Cannot read properties of undefined (reading 'length')
            // for (const f = 0, fl = sphere.geometry.faces.length; f < fl; f++) {
            //     const face = sphere.geometry.faces[f];
            //     const centroid = new THREE.Vector3(0, 0, 0);
            //     centroid.add(sphere.geometry.vertices[face.a]);
            //     centroid.add(sphere.geometry.vertices[face.b]);
            //     centroid.add(sphere.geometry.vertices[face.c]);
            //     centroid.divideScalar(3);

            //     const arrow = new THREE.ArrowHelper(face.normal, centroid, 2, 0x3333ff, 0.5, 0.5);
            //     sphere.add(arrow);
            // }

            // cube.position = sphere.position;
            // plane.position = sphere.position;

            // add the sphere to the scene
            this.scene.add(cube);

            // add subtle ambient lighting
            const ambientLight = new THREE.AmbientLight(0x0c0c0c);
            this.scene.add(ambientLight);

            // add spotlight for the shadows
            const spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(-40, 60, -10);
            spotLight.castShadow = true;
            this.scene.add(spotLight);

            this.containerRef.appendChild(this.WebGLRenderer.domElement);

            const trackballControls = new TrackballControls(camera, this.WebGLRenderer.domElement);
            const clock = new THREE.Clock();
            this.scene.overrideMaterial = new THREE.MeshDepthMaterial();

            const _this = this;

            const controls = {
                rotationSpeed: 0.02,
                bouncingSpeed: 0.03,
                selectedMesh: 'cube'
            };

            let step = 0;

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
