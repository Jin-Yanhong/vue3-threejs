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
            plane.position.set(15, 0, 0);
            plane.receiveShadow = true;
            this.scene.add(plane);

            const spotLight = new THREE.SpotLight(0xffffff, 1.2, 150, 120);
            spotLight.position.set(-40, 60, -10);
            spotLight.castShadow = true;
            this.scene.add(spotLight);
            spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
            this.scene.add(spotLight);

            const ambienLight = new THREE.AmbientLight(0x353535);
            this.scene.add(ambienLight);

            this.WebGLRenderer.render(this.scene, camera);
            this.containerRef.appendChild(this.WebGLRenderer.domElement);

            const _this = this;

            const controls = {
                rotationSpeed: 0.02,
                numberOfObjects: _this.scene.children.length,

                removeCube: function () {
                    const allChildren = _this.scene.children;
                    const lastObject = allChildren[allChildren.length - 1];
                    if (lastObject instanceof THREE.Mesh) {
                        _this.scene.remove(lastObject);
                        this.numberOfObjects = _this.scene.children.length;
                    }
                },

                addCube: function () {
                    const cubeSize = Math.ceil(Math.random() * 3);
                    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                    const cubeMaterial = new THREE.MeshLambertMaterial({
                        color: Math.random() * 0xffffff,
                    });
                    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    cube.castShadow = true;
                    cube.name = 'cube-' + _this.scene.children.length;
                    cube.position.x = -30 + Math.round(Math.random() * planeGeometry.parameters.width);
                    cube.position.y = Math.round(Math.random() * 5);
                    cube.position.z = -20 + Math.round(Math.random() * planeGeometry.parameters.height);
                    _this.scene.add(cube);
                    this.numberOfObjects = _this.scene.children.length;
                },

                outputObjects: function () {
                    console.log(_this.scene.children);
                },
            };
            this.gui.add(controls, 'rotationSpeed', 0, 0.5);
            this.gui.add(controls, 'addCube');
            this.gui.add(controls, 'removeCube');
            this.gui.add(controls, 'outputObjects');
            this.gui.add(controls, 'numberOfObjects').listen();

            const trackballControls = new TrackballControls(camera, this.WebGLRenderer.domElement);
            const clock = new THREE.Clock();

            const renderScene = () => {
                trackballControls.update(clock.getDelta());
                stats.update();
                this.scene.traverse(function (e) {
                    if (e instanceof THREE.Mesh && e != plane) {
                        e.rotation.x += controls.rotationSpeed;
                        e.rotation.y += controls.rotationSpeed;
                        e.rotation.z += controls.rotationSpeed;
                    }
                });
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
