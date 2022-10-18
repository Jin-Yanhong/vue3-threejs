<template>
    <div class="view" ref="containerRef"></div>
</template>
<script>
import { initStats } from '@/util/util';
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

            const innerWidth = window.innerWidth - 300;
            const innerHeight = window.innerHeight;

            const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
            this.WebGLRenderer.setClearColor(new THREE.Color(0x000000));
            this.WebGLRenderer.setSize(innerWidth, innerHeight);
            this.WebGLRenderer.shadowMap.enabled = true;

            camera.position.x = -30;
            camera.position.y = 40;
            camera.position.z = 30;
            camera.lookAt(this.scene.position);
            const spotLight = new THREE.SpotLight(0xffffff, 1.2, 150, 120);
            spotLight.position.set(-40, 60, -10);
            spotLight.castShadow = true;
            this.scene.add(spotLight);
            spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
            this.scene.add(spotLight);

            this.createBoundingWall(this.scene);
            this.createGroundPlane(this.scene);
            this.createHouse(this.scene);
            this.createTree(this.scene);

            const ambientLight = new THREE.AmbientLight(0x353535);
            this.scene.add(ambientLight);
            this.WebGLRenderer.render(this.scene, camera);
            this.containerRef.appendChild(this.WebGLRenderer.domElement);

            const controls = {
                intensity: ambientLight.intensity,
                ambientColor: ambientLight.color.getStyle(),
                disableSpotlight: false,
            };
            this.gui.add(controls, 'intensity', 0, 3, 0.1).onChange(function (e) {
                ambientLight.color = new THREE.Color(controls.ambientColor);
                ambientLight.intensity = controls.intensity;
            });
            this.gui.addColor(controls, 'ambientColor').onChange(function (e) {
                ambientLight.color = new THREE.Color(controls.ambientColor);
                ambientLight.intensity = controls.intensity;
            });
            this.gui.add(controls, 'disableSpotlight').onChange(function (e) {
                spotLight.visible = !e;
            });

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
        depose() {
            this.WebGLRenderer.dispose();
            this.gui.destroy();
            const panelGroup = document.querySelector('#panelGroup');
            document.body.removeChild(panelGroup);
        },
        createTree(scene) {
            const trunk = new THREE.BoxGeometry(1, 8, 1);
            const leaves = new THREE.SphereGeometry(4);

            // create the mesh
            const trunkMesh = new THREE.Mesh(
                trunk,
                new THREE.MeshPhongMaterial({
                    color: 0x8b4513,
                })
            );
            const leavesMesh = new THREE.Mesh(
                leaves,
                new THREE.MeshPhongMaterial({
                    color: 0x00ff00,
                })
            );

            // position the trunk. Set y to half of height of trunk
            trunkMesh.position.set(-10, 4, 0);
            leavesMesh.position.set(-10, 12, 0);

            trunkMesh.castShadow = true;
            trunkMesh.receiveShadow = true;
            leavesMesh.castShadow = true;
            leavesMesh.receiveShadow = true;

            this.scene.add(trunkMesh);
            this.scene.add(leavesMesh);
        },
        createBoundingWall(scene) {
            const wallLeft = new THREE.BoxGeometry(70, 2, 2);
            const wallRight = new THREE.BoxGeometry(70, 2, 2);
            const wallTop = new THREE.BoxGeometry(2, 2, 50);
            const wallBottom = new THREE.BoxGeometry(2, 2, 50);

            const wallMaterial = new THREE.MeshPhongMaterial({
                color: 0xa0522d,
            });

            const wallLeftMesh = new THREE.Mesh(wallLeft, wallMaterial);
            const wallRightMesh = new THREE.Mesh(wallRight, wallMaterial);
            const wallTopMesh = new THREE.Mesh(wallTop, wallMaterial);
            const wallBottomMesh = new THREE.Mesh(wallBottom, wallMaterial);

            wallLeftMesh.position.set(15, 1, -25);
            wallRightMesh.position.set(15, 1, 25);
            wallTopMesh.position.set(-19, 1, 0);
            wallBottomMesh.position.set(49, 1, 0);

            this.scene.add(wallLeftMesh);
            this.scene.add(wallRightMesh);
            this.scene.add(wallBottomMesh);
            this.scene.add(wallTopMesh);
        },

        createGroundPlane(scene) {
            // create the ground plane
            const planeGeometry = new THREE.PlaneGeometry(70, 50);
            const planeMaterial = new THREE.MeshPhongMaterial({
                color: 0x9acd32,
            });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.receiveShadow = true;

            // rotate and position the plane
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.x = 15;
            plane.position.y = 0;
            plane.position.z = 0;

            scene.add(plane);
        },

        createHouse(scene) {
            const roof = new THREE.ConeGeometry(5, 4);
            const base = new THREE.CylinderGeometry(5, 5, 6);
            // create the mesh
            const roofMesh = new THREE.Mesh(
                roof,
                new THREE.MeshPhongMaterial({
                    color: 0x8b7213,
                })
            );
            const baseMesh = new THREE.Mesh(
                base,
                new THREE.MeshPhongMaterial({
                    color: 0xffe4c4,
                })
            );

            roofMesh.position.set(25, 8, 0);
            baseMesh.position.set(25, 3, 0);

            roofMesh.receiveShadow = true;
            baseMesh.receiveShadow = true;
            roofMesh.castShadow = true;
            baseMesh.castShadow = true;

            scene.add(roofMesh);
            scene.add(baseMesh);
        },
    },
});
</script>
