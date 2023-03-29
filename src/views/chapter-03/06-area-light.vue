<template>
    <div class="view" ref="containerRef"></div>
</template>
<script>
import { initStats } from '@/three.util';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import { defineComponent, ref } from 'vue';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';
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
            camera.position.set(-50, 30, 50);

            RectAreaLightUniformsLib.init();

            this.WebGLRenderer.setClearColor(new THREE.Color(0x000000));
            this.WebGLRenderer.setSize(innerWidth, innerHeight);
            this.WebGLRenderer.shadowMap.enabled = true;
            this.WebGLRenderer.setPixelRatio(window.devicePixelRatio);
            this.WebGLRenderer.setSize(window.innerWidth, window.innerHeight);
            this.WebGLRenderer.outputEncoding = THREE.sRGBEncoding;

            this.WebGLRenderer.render(this.scene, camera);
            this.containerRef.appendChild(this.WebGLRenderer.domElement);

            const trackballControls = new TrackballControls(camera, this.WebGLRenderer.domElement);
            const clock = new THREE.Clock();

            // create the ground plane
            const planeGeometry = new THREE.PlaneGeometry(70, 70, 1, 1);
            const planeMaterial = new THREE.MeshStandardMaterial({
                roughness: 0.044676705160855, // calculated from shininess = 1000
                metalness: 0.0
            });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            // plane.receiveShadow  = true;

            // rotate and position the plane
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.x = 0;
            plane.position.y = 0;
            plane.position.z = 0;

            // add the plane to the scene
            this.scene.add(plane);

            const spotLight0 = new THREE.SpotLight(0xcccccc);
            spotLight0.position.set(-40, 60, -10);
            spotLight0.intensity = 0.1;
            spotLight0.lookAt(plane);
            this.scene.add(spotLight0);

            const areaLight1 = new THREE.RectAreaLight(0xff0000, 500, 4, 10);
            areaLight1.position.set(-10, 10, -35);
            this.scene.add(areaLight1);
            const rectLightHelper1 = new RectAreaLightHelper(areaLight1);
            this.scene.add(rectLightHelper1);

            const areaLight2 = new THREE.RectAreaLight(0x00ff00, 500, 4, 10);
            areaLight2.position.set(0, 10, -35);
            this.scene.add(areaLight2);
            const rectLightHelper2 = new RectAreaLightHelper(areaLight2);
            this.scene.add(rectLightHelper2);

            const areaLight3 = new THREE.RectAreaLight(0x0000ff, 500, 4, 10);
            areaLight3.position.set(10, 10, -35);
            this.scene.add(areaLight3);
            const rectLightHelper3 = new RectAreaLightHelper(areaLight3);
            this.scene.add(rectLightHelper3);
            const planeGeometry1 = new THREE.BoxGeometry(4, 10, 0);
            const planeGeometry1Mat = new THREE.MeshBasicMaterial({
                color: 0xff0000
            });
            let plane1 = new THREE.Mesh(planeGeometry1, planeGeometry1Mat);
            plane1.position.copy(areaLight1.position);
            this.scene.add(plane1);

            const planeGeometry2 = new THREE.BoxGeometry(4, 10, 0);
            const planeGeometry2Mat = new THREE.MeshBasicMaterial({
                color: 0x00ff00
            });
            let plane2 = new THREE.Mesh(planeGeometry2, planeGeometry2Mat);

            plane2.position.copy(areaLight2.position);
            this.scene.add(plane2);

            const planeGeometry3 = new THREE.BoxGeometry(4, 10, 0);
            const planeGeometry3Mat = new THREE.MeshBasicMaterial({
                color: 0x0000ff
            });
            let plane3 = new THREE.Mesh(planeGeometry3, planeGeometry3Mat);

            plane3.position.copy(areaLight3.position);
            this.scene.add(plane3);

            const controls = {
                rotationSpeed: 0.02,
                color1: 0xff0000,
                intensity1: 500,
                color2: 0x00ff00,
                intensity2: 500,
                color3: 0x0000ff,
                intensity3: 500
            };

            const _this = this;

            this.gui.addColor(controls, 'color1').onChange(function (e) {
                areaLight1.color = new THREE.Color(e);
                planeGeometry1Mat.color = new THREE.Color(e);
                _this.scene.remove(plane1);
                plane1 = new THREE.Mesh(planeGeometry1, planeGeometry1Mat);
                plane1.position.copy(areaLight1.position);
                _this.scene.add(plane1);
            });
            this.gui.add(controls, 'intensity1', 0, 1000).onChange(function (e) {
                areaLight1.intensity = e;
            });
            this.gui.addColor(controls, 'color2').onChange(function (e) {
                areaLight2.color = new THREE.Color(e);
                planeGeometry2Mat.color = new THREE.Color(e);
                _this.scene.remove(plane2);
                plane2 = new THREE.Mesh(planeGeometry2, planeGeometry2Mat);
                plane2.position.copy(areaLight2.position);
                _this.scene.add(plane2);
            });
            this.gui.add(controls, 'intensity2', 0, 1000).onChange(function (e) {
                areaLight2.intensity = e;
            });
            this.gui.addColor(controls, 'color3').onChange(function (e) {
                areaLight3.color = new THREE.Color(e);
                planeGeometry3Mat.color = new THREE.Color(e);
                _this.scene.remove(plane3);
                plane3 = new THREE.Mesh(planeGeometry1, planeGeometry3Mat);
                plane3.position.copy(areaLight3.position);
                _this.scene.add(plane3);
            });
            this.gui.add(controls, 'intensity3', 0, 1000).onChange(function (e) {
                areaLight3.intensity = e;
            });

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
            document.querySelector('[class=\'view\']').removeChild(panelGroup);
        }
    }
});
</script>
