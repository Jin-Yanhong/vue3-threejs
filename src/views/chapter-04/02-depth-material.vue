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
            camera.position.set(-50, 40, 50);
            camera.lookAt(this.scene.position);

            this.WebGLRenderer.setClearColor(new THREE.Color(0xcccccc));
            this.WebGLRenderer.setSize(innerWidth, innerHeight);
            this.WebGLRenderer.shadowMap.enabled = true;
            this.WebGLRenderer.render(this.scene, camera);

            const spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(10, 10, 10);
            this.scene.add(spotLight);

            this.containerRef.appendChild(this.WebGLRenderer.domElement);

            const trackballControls = new TrackballControls(camera, this.WebGLRenderer.domElement);
            const clock = new THREE.Clock();
            this.scene.overrideMaterial = new THREE.MeshDepthMaterial();

            const _this = this;

            const controls = {
                cameraNear: camera.near,
                cameraFar: camera.far,
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
                    const cubeSize = Math.ceil(3 + Math.random() * 3);
                    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                    const cubeMaterial = new THREE.MeshBasicMaterial({
                        color: Math.random() * 0xffffff
                    });
                    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    cube.castShadow = true;
                    // position the cube randomly in the scene
                    cube.position.x = -60 + Math.round(Math.random() * 100);
                    cube.position.y = Math.round(Math.random() * 10);
                    cube.position.z = -100 + Math.round(Math.random() * 150);

                    _this.scene.add(cube);
                    this.numberOfObjects = _this.scene.children.length;
                },

                outputObjects: function () {
                    console.log(_this.scene.children);
                }
            };

            const spGui = this.gui.addFolder('THREE.MeshDepthMaterial');
            spGui.add(this.scene.overrideMaterial, 'wireframe');
            spGui.add(this.scene.overrideMaterial, 'wireframeLinewidth', 0, 20);

            this.gui.add(controls, 'rotationSpeed', 0, 0.5);
            this.gui.add(controls, 'addCube');
            this.gui.add(controls, 'removeCube');
            this.gui.add(controls, 'cameraNear', 0, 100).onChange(function (e) {
                camera.near = e;
                camera.updateProjectionMatrix();
            });
            this.gui.add(controls, 'cameraFar', 50, 200).onChange(function (e) {
                camera.far = e;
                camera.updateProjectionMatrix();
            });

            let i = 0;
            while (i < 10) {
                controls.addCube();
                i++;
            }

            const renderScene = () => {
                trackballControls.update(clock.getDelta());
                stats.update();

                this.scene.traverse(function (e) {
                    if (e instanceof THREE.Mesh) {
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
        depose() {
            this.WebGLRenderer.dispose();
            this.gui.destroy();
            const panelGroup = document.querySelector('#panelGroup');
            document.body.removeChild(panelGroup);
        }
    }
});
</script>
