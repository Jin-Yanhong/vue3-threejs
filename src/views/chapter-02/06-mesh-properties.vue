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
            gui,
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
            camera.position.x = -30;
            camera.position.y = 40;
            camera.position.z = 30;
            camera.lookAt(this.scene.position);

            this.WebGLRenderer.setClearColor(new THREE.Color(0x000000));
            this.WebGLRenderer.setSize(innerWidth, innerHeight);
            this.WebGLRenderer.shadowMap.enabled = true;

            const planeGeometry = new THREE.PlaneGeometry(60, 20);
            const planeMaterial = new THREE.MeshLambertMaterial({
                color: 0xaaaaaa,
            });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.set(0, 0, 0);
            plane.receiveShadow = true;
            this.scene.add(plane);

            const ambientLight = new THREE.AmbientLight(0x3c3c3c);
            this.scene.add(ambientLight);

            const spotLight = new THREE.SpotLight(0xffffff, 1.2, 150, 120);
            spotLight.position.set(-40, 60, -10);
            spotLight.castShadow = true;
            this.scene.add(spotLight);
            spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
            this.scene.add(spotLight);

            this.WebGLRenderer.render(this.scene, camera);
            this.containerRef.appendChild(this.WebGLRenderer.domElement);

            const controls = {
                scaleX: 1,
                scaleY: 1,
                scaleZ: 1,
                positionX: 0,
                positionY: 0,
                positionZ: 0,
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                scale: 1,
                translateX: 0,
                translateY: 0,
                translateZ: 0,
                visible: true,

                translate: function () {
                    cube.translateX(this.translateX);
                    cube.translateY(this.translateY);
                    cube.translateZ(this.translateZ);
                    this.positionX = cube.position.x;
                    this.positionY = cube.position.y;
                    this.positionZ = cube.position.z;
                },
            };

            // const materials = [
            //   new THREE.MeshLambertMaterial({opacity: 0.8, color: 0x44ff44, transparent: true}),
            //   new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
            // ];
            // const cube = THREE.SceneUtils.createMultiMaterialObject(geom, materials);
            const material = new THREE.MeshLambertMaterial({ color: 0x44ff44 });
            const geom = new THREE.BoxGeometry(5, 8, 3);
            const cube = new THREE.Mesh(geom, material);
            cube.position.y = 4;
            cube.castShadow = true;
            this.scene.add(cube);

            const guiScale = this.gui.addFolder('scale');
            guiScale.add(controls, 'scaleX', 0, 5);
            guiScale.add(controls, 'scaleY', 0, 5);
            guiScale.add(controls, 'scaleZ', 0, 5);

            const guiPosition = this.gui.addFolder('position');
            const contX = guiPosition.add(controls, 'positionX', -10, 10);
            const contY = guiPosition.add(controls, 'positionY', -4, 20);
            const contZ = guiPosition.add(controls, 'positionZ', -10, 10);

            contX.listen();

            contX.onChange(function (value) {
                cube.position.x = controls.positionX;
                // cube.children[1].position.x = controls.positionX;
            });
            contY.listen();

            contY.onChange(function (value) {
                cube.position.y = controls.positionY;
            });

            contZ.listen();

            contZ.onChange(function (value) {
                cube.position.z = controls.positionZ;
            });

            const guiRotation = this.gui.addFolder('rotation');
            guiRotation.add(controls, 'rotationX', -4, 4);
            guiRotation.add(controls, 'rotationY', -4, 4);
            guiRotation.add(controls, 'rotationZ', -4, 4);

            const guiTranslate = this.gui.addFolder('translate');
            guiTranslate.add(controls, 'translateX', -10, 10);
            guiTranslate.add(controls, 'translateY', -10, 10);
            guiTranslate.add(controls, 'translateZ', -10, 10);
            guiTranslate.add(controls, 'translate');
            this.gui.add(controls, 'visible');

            const trackballControls = new TrackballControls(camera, this.WebGLRenderer.domElement);
            const clock = new THREE.Clock();
            const renderScene = () => {
                trackballControls.update(clock.getDelta());
                stats.update();
                cube.visible = controls.visible;
                cube.rotation.x = controls.rotationX;
                cube.rotation.y = controls.rotationY;
                cube.rotation.z = controls.rotationZ;
                cube.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);
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
        },
    },
});
</script>
<style lang="scss" scoped></style>
