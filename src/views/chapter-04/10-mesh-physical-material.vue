<template>
    <div class="view" ref="containerRef"></div>
</template>
<script>
import { initStats } from '@/three.util';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import { defineComponent, ref } from 'vue';
import { addMeshSelection, addLargeGroundPlane } from '@/three.util';
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

            addLargeGroundPlane(this.scene);

            const spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(-0, 30, 60);
            spotLight.castShadow = true;
            spotLight.intensity = 0.6;

            this.scene.add(spotLight);

            let step = 0;

            const material = new THREE.MeshPhongMaterial({ color: 0x7777ff });

            const controls = {
                color: material.color.getStyle(),
                emissive: material.emissive.getStyle()
            };

            // addBasicMaterialSettings(gui, controls, material);
            addMeshSelection(this.gui, controls, material, this.scene);

            const spGui = this.gui.addFolder('THREE.MeshPhongMaterial');

            spGui.add(material, 'reflectivity', 0, 1, 0.01);
            spGui.add(material, 'wireframe');
            spGui.add(material, 'wireframeLinewidth', 0, 20);
            spGui.add(material, 'wireframe');
            spGui.add(material, 'wireframeLinewidth', 0, 20);

            camera.lookAt(controls.selected.position);

            const renderScene = () => {
                trackballControls.update(clock.getDelta());
                stats.update();

                if (controls.selected) {
                    controls.selected.rotation.y = step += 0.01;
                }
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
