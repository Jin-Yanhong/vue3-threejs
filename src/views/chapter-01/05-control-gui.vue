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
    setup () {
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
    mounted () {
        this.init();
    },
    beforeUnmount () {
        this.depose();
    },
    methods: {
        init () {
            const stats = initStats();

            const innerWidth = window.innerWidth - 300;
            const innerHeight = window.innerHeight;

            const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);

            this.WebGLRenderer.setClearColor(new THREE.Color(0x000000));
            this.WebGLRenderer.setSize(innerWidth, innerHeight);
            this.WebGLRenderer.shadowMap.enabled = true;

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

            this.WebGLRenderer.render(this.scene, camera);

            this.containerRef.appendChild(this.WebGLRenderer.domElement);

            let step = 0;

            const controls = {
                rotationSpeed: 0.02,
                bouncingSpeed: 0.03
            };

            this.gui.add(controls, 'rotationSpeed', 0, 0.5);
            this.gui.add(controls, 'bouncingSpeed', 0, 0.5);

            const trackballControls = new TrackballControls(camera, this.WebGLRenderer.domElement);
            const clock = new THREE.Clock();

            const renderScene = () => {
                trackballControls.update(clock.getDelta());
                stats.update();

                cube.rotation.x += controls.rotationSpeed;
                cube.rotation.y += controls.rotationSpeed;
                cube.rotation.z += controls.rotationSpeed;

                // bounce the sphere up and down
                step += controls.bouncingSpeed;
                sphere.position.x = 20 + 10 * Math.cos(step);
                sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

                requestAnimationFrame(renderScene);
                this.WebGLRenderer.render(this.scene, camera);
            };
            renderScene();
        },

        depose () {
            this.WebGLRenderer.dispose();
            this.gui.destroy();
            const panelGroup = document.querySelector('#panelGroup');
            document.body.removeChild(panelGroup);
        }
    }
});
</script>
<style lang="scss" scoped></style>
