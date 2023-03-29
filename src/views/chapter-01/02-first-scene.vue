<template>
    <div class="view" ref="containerRef"></div>
</template>
<script lang="ts">
import * as THREE from 'three';
import { windowSize } from '@/utils/constant';
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
            const innerWidth = windowSize.innerWidth;
            const innerHeight = windowSize.innerHeight;

            const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);

            this.WebGLRenderer.setClearColor(new THREE.Color(0x000000));
            this.WebGLRenderer.setSize(innerWidth, innerHeight);

            const axes = new THREE.AxesHelper(20);
            this.scene.add(axes);

            const planeGeometry = new THREE.PlaneGeometry(60, 20);
            const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);

            // rotate and position the plane
            // xyz 轴分别对应图上的 红绿蓝色
            // 此处的角度 是 弧度 ，并不是 angle(角度)
            // 角度 = 弧度 × 180°/π

            plane.rotation.x = -0.5 * Math.PI;
            plane.position.x = 15;
            plane.position.y = 0;
            plane.position.z = 0;

            this.scene.add(plane);

            const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
            const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

            cube.position.x = -4;
            cube.position.y = 3;
            cube.position.z = 0;

            this.scene.add(cube);

            const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
            const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x7777ff, wireframe: true });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

            sphere.position.x = 20;
            sphere.position.y = 4;
            sphere.position.z = 2;

            this.scene.add(sphere);
            camera.position.x = -30;
            camera.position.y = 40;
            camera.position.z = 30;
            camera.lookAt(this.scene.position);
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

