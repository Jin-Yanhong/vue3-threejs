<template>
    <div class="view" ref="containerRef"></div>
</template>
<script>
import { initStats } from '@/util';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import { createMultiMaterialObject } from 'three/examples/jsm/utils/SceneUtils';

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
            this.WebGLRenderer.render(this.scene, camera);

            this.containerRef.appendChild(this.WebGLRenderer.domElement);

            const trackballControls = new TrackballControls(camera, this.WebGLRenderer.domElement);
            const clock = new THREE.Clock();

            const _this = this;

            const controls = {
                cameraNear: camera.near,
                cameraFar: camera.far,
                rotationSpeed: 0.02,
                numberOfObjects: _this.scene.children.length,
                color: 0x00ff00,

                removeCube: function () {
                    const allChildren = _this.scene.children;
                    const lastObject = allChildren[allChildren.length - 1];
                    if (lastObject instanceof THREE.Group) {
                        _this.scene.remove(lastObject);
                        this.numberOfObjects = _this.scene.children.length;
                    }
                },

                addCube: function () {
                    const cubeSize = Math.ceil(3 + Math.random() * 3);
                    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

                    // const cubeMaterial = new THREE.MeshLambertMaterial({color:  Math.random() * 0xffffff });
                    const cubeMaterial = new THREE.MeshDepthMaterial();
                    const colorMaterial = new THREE.MeshBasicMaterial({
                        color: controls.color,
                        transparent: true,
                        blending: THREE.MultiplyBlending
                    });
                    const cube = createMultiMaterialObject(cubeGeometry, [colorMaterial, cubeMaterial]);
                    cube.children[1].scale.set(0.99, 0.99, 0.99);
                    cube.castShadow = true;

                    // position the cube randomly in the scene
                    cube.position.x = -60 + Math.round(Math.random() * 100);
                    cube.position.y = Math.round(Math.random() * 10);
                    cube.position.z = -100 + Math.round(Math.random() * 150);

                    // add the cube to the scene
                    _this.scene.add(cube);
                    this.numberOfObjects = _this.scene.children.length;
                },
                outputObjects: function () {
                    console.log(_this.scene.children);
                }
            };

            let i = 0;
            while (i < 10) {
                controls.addCube();
                i++;
            }
            const renderScene = () => {
                trackballControls.update(clock.getDelta());
                stats.update();

                // rotate the cubes around its axes
                this.scene.traverse(function (e) {
                    if (e instanceof THREE.Group) {
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
