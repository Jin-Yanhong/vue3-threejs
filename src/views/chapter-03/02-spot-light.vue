<template>
    <div class="view" ref="containerRef"></div>
</template>
<script>
import { initStats } from '@/util';
import * as dat from 'dat.gui';
import * as THREE from 'three';
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
            camera.lookAt(new THREE.Vector3(40, -26, -16));

            // camera.position.copy(new THREE.Vector3(-30, 40, 30));
            // camera.position.copy(new THREE.Vector3(-20, 20, 16));
            camera.position.x = -40;
            camera.position.y = 30;
            camera.position.z = 20;

            this.WebGLRenderer.shadowMap.enabled = true;
            this.WebGLRenderer.shadowMapSoft = true;
            this.WebGLRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.WebGLRenderer.shadowMap.enabled = true;

            this.WebGLRenderer.setClearColor(new THREE.Color(0x000000));
            this.WebGLRenderer.setSize(window.innerWidth, window.innerHeight);

            const cubeAndSphere = this.addDefaultCubeAndSphere(this.scene);
            const cube = cubeAndSphere.cube;
            const sphere = cubeAndSphere.sphere;

            const plane = this.addGroundPlane(this.scene);

            const ambiColor = '#1c1c1c';
            const ambientLight = new THREE.AmbientLight(ambiColor);
            this.scene.add(ambientLight);

            // add target and light
            // const target = new THREE.Object3D({
            //     position: new THREE.Vector3(5, 0, 0),
            // });

            const spotLight0 = new THREE.SpotLight(0xcccccc);
            spotLight0.position.set(-40, 60, -10);
            spotLight0.lookAt(plane);
            this.scene.add(spotLight0);

            const spotLight = new THREE.SpotLight('#ffffff');
            spotLight.position.set(-40, 60, -10);
            // spotLight.castShadow = true;
            // spotLight.shadow.camera.near = 1;
            // spotLight.shadow.camera.far = 100;
            // spotLight.target = plane;
            // spotLight.distance = 0;
            spotLight.angle = 0.4;
            // spotLight.shadow.camera.fov = 120;
            this.scene.add(spotLight);
            const debugCamera = new THREE.CameraHelper(spotLight.shadow.camera);

            const spotLightHelper = new THREE.SpotLightHelper(spotLight);
            this.scene.add(spotLightHelper);

            // add a small sphere simulating the pointlight
            const sphereLight = new THREE.SphereGeometry(0.2);
            const sphereLightMaterial = new THREE.MeshBasicMaterial({
                color: 0xac6c25
            });
            const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
            // sphereLightMesh.castShadow = true;

            // sphereLightMesh.position = new THREE.Vector3(3, 20, 3);
            this.scene.add(sphereLightMesh);

            // for controlling the rendering
            let step = 0;
            let invert = 1;
            let phase = 0;
            const _this = this;

            const controls = {
                rotationSpeed: 0.03,
                bouncingSpeed: 0.03,
                ambientColor: ambiColor,
                pointColor: spotLight.color.getStyle(),
                intensity: 1,
                distance: 0,
                angle: 0.1,
                shadowDebug: false,
                castShadow: true,
                target: 'Plane',
                stopMovingLight: false,
                penumbra: 0
            };

            this.gui.addColor(controls, 'ambientColor').onChange(function (e) {
                ambientLight.color = new THREE.Color(e);
            });

            this.gui.addColor(controls, 'pointColor').onChange(function (e) {
                spotLight.color = new THREE.Color(e);
            });

            this.gui.add(controls, 'angle', 0, Math.PI * 2).onChange(function (e) {
                spotLight.angle = e;
            });

            this.gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
                spotLight.intensity = e;
            });

            this.gui.add(controls, 'penumbra', 0, 1).onChange(function (e) {
                spotLight.penumbra = e;
            });

            this.gui.add(controls, 'distance', 0, 200).onChange(function (e) {
                spotLight.distance = e;
            });

            this.gui.add(controls, 'shadowDebug').onChange(function (e) {
                if (e) {
                    _this.scene.add(debugCamera);
                } else {
                    _this.scene.remove(debugCamera);
                }
            });

            this.gui.add(controls, 'castShadow').onChange(function (e) {
                spotLight.castShadow = e;
            });

            this.gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function (e) {
                switch (e) {
                case 'Plane':
                    spotLight.target = plane;
                    break;
                case 'Sphere':
                    spotLight.target = sphere;
                    break;
                case 'Cube':
                    spotLight.target = cube;
                    break;
                }
            });

            this.gui.add(controls, 'stopMovingLight').onChange(function (e) {
                controls.stopMovingLight = e;
            });

            this.WebGLRenderer.render(this.scene, camera);
            this.containerRef.appendChild(this.WebGLRenderer.domElement);

            const renderScene = () => {
                stats.update();

                // rotate the cube around its axes
                cube.rotation.x += controls.rotationSpeed;
                cube.rotation.y += controls.rotationSpeed;
                cube.rotation.z += controls.rotationSpeed;

                // bounce the sphere up and down
                step += controls.bouncingSpeed;
                sphere.position.x = 20 + 10 * Math.cos(step);
                sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

                if (!controls.stopMovingLight) {
                    if (phase > 2 * Math.PI) {
                        invert = invert * -1;
                        phase -= 2 * Math.PI;
                    } else {
                        phase += controls.rotationSpeed;
                    }
                    sphereLightMesh.position.z = +(7 * Math.sin(phase));
                    sphereLightMesh.position.x = +(14 * Math.cos(phase));
                    sphereLightMesh.position.y = 15;

                    if (invert < 0) {
                        const pivot = 14;
                        sphereLightMesh.position.x = invert * (sphereLightMesh.position.x - pivot) + pivot;
                    }

                    spotLight.position.copy(sphereLightMesh.position);
                }

                spotLightHelper.update();

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
        addDefaultCubeAndSphere (scene) {
            // create a cube
            const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
            const cubeMaterial = new THREE.MeshLambertMaterial({
                color: 0xff0000
            });
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;

            // position the cube
            cube.position.x = 10;
            cube.position.y = 3;
            cube.position.z = 0;

            // add the cube to the scene
            scene.add(cube);

            const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
            const sphereMaterial = new THREE.MeshLambertMaterial({
                color: 0x7777ff
            });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

            // position the sphere
            sphere.position.x = 20;
            sphere.position.y = 6;
            sphere.position.z = 0;
            sphere.castShadow = true;

            // add the sphere to the scene
            scene.add(sphere);

            return {
                cube: cube,
                sphere: sphere
            };
        },
        addGroundPlane (scene) {
            // create the ground plane
            const planeGeometry = new THREE.PlaneGeometry(60, 20, 120, 120);
            const planeMaterial = new THREE.MeshPhongMaterial({
                color: 0xffffff
            });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.receiveShadow = true;

            // rotate and position the plane
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.x = 15;
            plane.position.y = 0;
            plane.position.z = 0;

            scene.add(plane);

            return plane;
        }
    }
});
</script>
