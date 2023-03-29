<template>
    <div class="view" ref="containerRef"></div>
</template>
<script>
import { initStats } from '@/three.util';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import { defineComponent, ref } from 'vue';
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
            camera.position.x = -30;
            camera.position.y = 40;
            camera.position.z = 30;
            camera.lookAt(this.scene.position);

            this.WebGLRenderer.setClearColor(new THREE.Color(0x000000));
            this.WebGLRenderer.setSize(innerWidth, innerHeight);
            this.WebGLRenderer.shadowMap.enabled = true;

            const textureGrass = new THREE.TextureLoader().load('./assets/textures/ground/grasslight-big.jpg');
            textureGrass.wrapS = THREE.RepeatWrapping;
            textureGrass.wrapT = THREE.RepeatWrapping;
            textureGrass.repeat.set(10, 10);

            const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 20, 20);
            const planeMaterial = new THREE.MeshLambertMaterial({
                map: textureGrass
            });

            //        var planeMaterial = new THREE.MeshLambertMaterial();
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.receiveShadow = true;

            // rotate and position the plane
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.x = 15;
            plane.position.y = 0;
            plane.position.z = 0;
            this.scene.add(plane);

            // create a cube
            const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
            const cubeMaterial = new THREE.MeshLambertMaterial({
                color: 0xff3333
            });
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;
            cube.position.x = -4;
            cube.position.y = 3;
            cube.position.z = 0;
            this.scene.add(cube);

            const sphereGeometry = new THREE.SphereGeometry(4, 25, 25);
            const sphereMaterial = new THREE.MeshPhongMaterial({
                color: 0x7777ff
            });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.x = 10;
            sphere.position.y = 5;
            sphere.position.z = 10;
            sphere.castShadow = true;
            this.scene.add(sphere);

            // add spotlight for a bit of light
            const spotLight0 = new THREE.SpotLight(0xcccccc);
            spotLight0.position.set(-40, 60, -10);
            spotLight0.lookAt(plane);
            this.scene.add(spotLight0);

            const hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
            hemiLight.position.set(0, 500, 0);
            this.scene.add(hemiLight);

            const pointColor = '#ffffff';
            const dirLight = new THREE.DirectionalLight(pointColor);
            dirLight.position.set(30, 10, -50);
            dirLight.castShadow = true;
            dirLight.target = plane;
            dirLight.shadow.camera.near = 0.1;
            dirLight.shadow.camera.far = 200;
            dirLight.shadow.camera.left = -50;
            dirLight.shadow.camera.right = 50;
            dirLight.shadow.camera.top = 50;
            dirLight.shadow.camera.bottom = -50;
            dirLight.shadow.mapSize.width = 2048;
            dirLight.shadow.mapSize.height = 2048;
            this.scene.add(dirLight);

            let step = 0;

            const controls = {
                rotationSpeed: 0.03,
                bouncingSpeed: 0.03,
                hemisphere: true,
                color: 0x0000ff,
                groundColor: 0x00ff00,
                intensity: 0.6
            };

            this.gui.add(controls, 'hemisphere').onChange(function (e) {
                if (!e) {
                    hemiLight.intensity = 0;
                } else {
                    hemiLight.intensity = controls.intensity;
                }
            });
            this.gui.addColor(controls, 'groundColor').onChange(function (e) {
                hemiLight.groundColor = new THREE.Color(e);
            });
            this.gui.addColor(controls, 'color').onChange(function (e) {
                hemiLight.color = new THREE.Color(e);
            });
            this.gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
                hemiLight.intensity = e;
            });

            this.WebGLRenderer.render(this.scene, camera);
            this.containerRef.appendChild(this.WebGLRenderer.domElement);

            const trackballControls = new TrackballControls(camera, this.WebGLRenderer.domElement);
            const clock = new THREE.Clock();

            const renderScene = () => {
                trackballControls.update(clock.getDelta());
                stats.update();

                // rotate the cube around its axes
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
        depose() {
            this.WebGLRenderer.dispose();
            this.gui.destroy();
            const panelGroup = document.querySelector('#panelGroup');
            document.querySelector('[class=\'view\']').removeChild(panelGroup);
        }
    }
});
</script>
