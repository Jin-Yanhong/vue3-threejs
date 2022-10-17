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
        scene.fog = new THREE.Fog(0xffffff, 10, 100);
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
            // add performance panel
            const stats = initStats();

            // create a camera, which defines where we're looking at.
            const innerWidth = window.innerWidth - 300;
            const innerHeight = window.innerHeight;

            // create a camera, which defines where we're looking at.
            const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);

            // create a render and set the size

            this.WebGLRenderer.setClearColor(new THREE.Color(0x000000));
            this.WebGLRenderer.setSize(innerWidth, innerHeight);
            this.WebGLRenderer.shadowMap.enabled = true;

            // create the ground plane
            const planeGeometry = new THREE.PlaneGeometry(60, 20);
            const planeMaterial = new THREE.MeshLambertMaterial({
                color: 0xaaaaaa,
            });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);

            // rotate and position the plane
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.set(15, 0, 0);
            plane.receiveShadow = true;

            // add the objects
            this.scene.add(plane);

            // position and point the camera to the center of the scene
            camera.position.x = -40;
            camera.position.y = 20;
            camera.position.z = 40;
            camera.lookAt(this.scene.position);

            // add spotlight for the shadows
            const spotLight = new THREE.SpotLight(0xffffff, 1.2, 150, 120);
            spotLight.position.set(-40, 60, -10);
            spotLight.castShadow = true;
            this.scene.add(spotLight);

            // If you want a more detailled shadow you can increase the mapSize used to draw the shadows.
            spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
            this.scene.add(spotLight);
            //
            const ambienLight = new THREE.AmbientLight(0x353535);
            this.scene.add(ambienLight);

            // add the output of the this.WebGLRenderer to the html element

            // render the scene
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

                    // position the cube randomly in the scene

                    cube.position.x = -30 + Math.round(Math.random() * planeGeometry.parameters.width);
                    cube.position.y = Math.round(Math.random() * 5);
                    cube.position.z = -20 + Math.round(Math.random() * planeGeometry.parameters.height);

                    // add the cube to the scene
                    _this.scene.add(cube);
                    this.numberOfObjects = _this.scene.children.length;
                },

                outputObjects: function () {
                    console.log(_this.scene.children);
                },
            };

            // add constiables to guiCcontrals

            this.gui.add(controls, 'rotationSpeed', 0, 0.5);
            this.gui.add(controls, 'addCube');
            this.gui.add(controls, 'removeCube');
            this.gui.add(controls, 'outputObjects');
            this.gui.add(controls, 'numberOfObjects').listen();

            // attach them here, since appendChild needs to be called first
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
                // render using requestAnimationFrame
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
