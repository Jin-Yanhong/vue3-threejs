<template>
    <div class="view" ref="containerRef"></div>
</template>
<script>
import * as dat from 'dat.gui';
import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import { createMultiMaterialObject } from 'three/examples/jsm/utils/SceneUtils';
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
            const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
            const planeMaterial = new THREE.MeshLambertMaterial({
                color: 0xffffff,
            });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.receiveShadow = true;

            // rotate and position the plane
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.x = 0;
            plane.position.y = 0;
            plane.position.z = 0;

            // add the objects
            this.scene.add(plane);

            // position and point the camera to the center of the scene
            camera.position.x = -40;
            camera.position.y = 20;
            camera.position.z = 40;
            camera.lookAt(this.scene.position);

            const ambienLight = new THREE.AmbientLight(0x353535);
            this.scene.add(ambienLight);

            const geometry = new THREE.BufferGeometry();
            const vertices = new Float32Array([1, 3, 1, 1, 3, -1, 1, -1, 1, 1, -1, -1, -1, 3, -1, -1, 3, 1, -1, -1, -1, -1, -1, 1]);

            // itemSize = 3 because there are 3 values (components) per vertex
            geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

            const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const mesh = new THREE.Mesh(geometry, material);

            mesh.castShadow = true;
            mesh.children.forEach(function (e) {
                e.castShadow = true;
            });

            this.scene.add(mesh);

            // add spotlight for the shadows
            const spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI / 4);
            spotLight.shadow.mapSize.height = 2048;
            spotLight.shadow.mapSize.width = 2048;
            spotLight.position.set(-40, 30, 30);
            spotLight.castShadow = true;
            spotLight.lookAt(mesh);
            this.scene.add(spotLight);

            const controlPoints = [];
            controlPoints.push(this.addControl(3, 5, 3));
            controlPoints.push(this.addControl(3, 5, 0));
            controlPoints.push(this.addControl(3, 0, 3));
            controlPoints.push(this.addControl(3, 0, 0));
            controlPoints.push(this.addControl(0, 5, 0));
            controlPoints.push(this.addControl(0, 5, 3));
            controlPoints.push(this.addControl(0, 0, 0));
            controlPoints.push(this.addControl(0, 0, 3));
            // render the scene
            this.WebGLRenderer.render(this.scene, camera);

            // add the output of the this.WebGLRenderer to the html element
            this.containerRef.appendChild(this.WebGLRenderer.domElement);

            // add gui controls
            const controls = {
                clone: function () {
                    const clonedGeometry = mesh.children[0].geometry.clone();
                    const materials = [new THREE.MeshLambertMaterial({ opacity: 0.8, color: 0xff44ff, transparent: true }), new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })];

                    const mesh2 = createMultiMaterialObject(clonedGeometry, materials);
                    mesh2.children.forEach(function (e) {
                        e.castShadow = true;
                    });

                    mesh2.translateX(5);
                    mesh2.translateZ(5);
                    mesh2.name = 'clone';
                    this.scene.remove(scene.getChildByName('clone'));
                    this.scene.add(mesh2);
                },
            };
            this.gui.add(controls, 'clone');

            for (let i = 0; i < 8; i++) {
                const f1 = this.gui.addFolder('Vertices ' + (i + 1));
                f1.add(controlPoints[i], 'x', -10, 10);
                f1.add(controlPoints[i], 'y', -10, 10);
                f1.add(controlPoints[i], 'z', -10, 10);
            }
            // attach them here, since appendChild needs to be called first
            const trackballControls = new TrackballControls(camera, this.WebGLRenderer.domElement);
            const clock = new THREE.Clock();

            const renderScene = () => {
                trackballControls.update(clock.getDelta());
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

        addControl (x, y, z) {
            const controls = {
                x: x,
                y: y,
                z: z,
            };
            return controls;
        },
    },
});
</script>
<style lang="scss" scoped></style>
