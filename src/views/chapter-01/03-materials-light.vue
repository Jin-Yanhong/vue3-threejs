<template>
    <div class="view" ref="containerRef"></div>
</template>
<script lang="ts">
import * as THREE from 'three';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const containerRef = ref<HTMLDivElement>();
        const scene = new THREE.Scene();
        const WebGLRenderer = new THREE.WebGLRenderer();
        return {
            containerRef,
            scene,
            WebGLRenderer
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
            const innerWidth = window.innerWidth - 300;
            const innerHeight = window.innerHeight;

            const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);

            this.WebGLRenderer.setClearColor(new THREE.Color(0x000000));
            this.WebGLRenderer.setSize(innerWidth, innerHeight);

            // renderer.shadowMap.enabled = true;

            // createTree(scene);
            // createHouse(scene);
            // createGroundPlane(scene);
            // createBoundingWall(scene);

            const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
            const cubeMaterial = new THREE.MeshLambertMaterial({
                color: 0xff0000
            });
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;

            cube.position.x = -4;
            cube.position.y = 2;
            cube.position.z = 0;

            const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
            const sphereMaterial = new THREE.MeshLambertMaterial({
                color: 0x7777ff
            });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

            sphere.position.x = 20;
            sphere.position.y = 4;
            sphere.position.z = 2;
            sphere.castShadow = true;

            const planeGeometry = new THREE.PlaneGeometry(60, 20);
            const planeMaterial = new THREE.MeshLambertMaterial({
                color: 0xaaaaaa
            });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);

            plane.rotation.x = -0.5 * Math.PI;
            plane.position.set(15, 0, 0);
            plane.receiveShadow = true;

            this.scene.add(cube);
            this.scene.add(sphere);
            this.scene.add(plane);

            camera.position.x = -30;
            camera.position.y = 40;
            camera.position.z = 30;
            camera.lookAt(this.scene.position);

            const spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(-40, 40, -15);
            spotLight.castShadow = true;
            spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
            spotLight.shadow.camera.far = 130;
            spotLight.shadow.camera.near = 40;

            // If you want a more detailled shadow you can increase the
            // mapSize used to draw the shadows.
            // spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
            this.scene.add(spotLight);

            const ambienLight = new THREE.AmbientLight(0x353535);
            this.scene.add(ambienLight);

            (this.containerRef as HTMLDivElement).appendChild(this.WebGLRenderer.domElement);

            this.WebGLRenderer.render(this.scene, camera);
        },
        depose() {
            this.WebGLRenderer.dispose();
        }
    }
});
</script>
<style lang="scss" scoped></style>
