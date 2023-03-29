<template>
    <div class="view" ref="containerRef"></div>
</template>
<script>
import { initStats } from '@/three.util';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import { defineComponent, ref } from 'vue';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare';
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
            camera.lookAt(new THREE.Vector3(10, 0, 0));

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
            const textureGrass = new THREE.TextureLoader().load('./assets/textures/ground/grasslight-big.jpg');
            textureGrass.wrapS = THREE.RepeatWrapping;
            textureGrass.wrapT = THREE.RepeatWrapping;
            textureGrass.repeat.set(10, 10);

            const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 20, 20);
            const planeMaterial = new THREE.MeshLambertMaterial({
                map: textureGrass
            });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.receiveShadow = true;

            // rotate and position the plane
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.x = 15;
            plane.position.y = 0;
            plane.position.z = 0;

            // add the plane to the scene
            this.scene.add(plane);

            // create a cube
            const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
            const cubeMaterial = new THREE.MeshLambertMaterial({
                color: 0xff3333
            });
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;

            // position the cube
            cube.position.x = -4;
            cube.position.y = 3;
            cube.position.z = 0;

            // add the cube to the scene
            this.scene.add(cube);

            const sphereGeometry = new THREE.SphereGeometry(4, 25, 25);
            const sphereMaterial = new THREE.MeshLambertMaterial({
                color: 0x7777ff
            });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

            // position the sphere
            sphere.position.x = 10;
            sphere.position.y = 5;
            sphere.position.z = 10;
            sphere.castShadow = true;

            // add the sphere to the scene
            this.scene.add(sphere);

            // add subtle ambient lighting
            const ambiColor = '#1c1c1c';
            const ambientLight = new THREE.AmbientLight(ambiColor);
            this.scene.add(ambientLight);

            // add spotlight for a bit of light
            const spotLight0 = new THREE.SpotLight(0xcccccc);
            spotLight0.position.set(-40, 60, -10);
            spotLight0.lookAt(plane);
            this.scene.add(spotLight0);

            const pointColor = '#ffffff';
            //    const spotLight = new THREE.SpotLight( pointColor);
            const spotLight = new THREE.DirectionalLight(pointColor);
            spotLight.position.set(30, 10, -50);
            spotLight.castShadow = true;
            spotLight.shadow.camera.near = 2;
            spotLight.shadow.camera.far = 200;
            spotLight.shadow.camera.fov = 50;
            spotLight.target = plane;
            spotLight.distance = 0;
            spotLight.shadow.camera.left = -100;
            spotLight.shadow.camera.right = 100;
            spotLight.shadow.camera.top = 100;
            spotLight.shadow.camera.bottom = -100;

            this.scene.add(spotLight);

            // call the render function
            let step = 0;

            const controls = {
                rotationSpeed: 0.03,
                bouncingSpeed: 0.03,
                ambientColor: ambiColor,
                pointColor: pointColor,
                intensity: 0.1,
                distance: 0,
                exponent: 30,
                angle: 0.1,
                debug: false,
                castShadow: true,
                onlyShadow: false,
                target: 'Plane'
            };

            this.gui.addColor(controls, 'ambientColor').onChange(function (e) {
                ambientLight.color = new THREE.Color(e);
            });

            this.gui.addColor(controls, 'pointColor').onChange(function (e) {
                spotLight.color = new THREE.Color(e);
            });

            this.gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
                spotLight.intensity = e;
            });

            // TODO: :3000/#/chapter-03/5:1 [.WebGL-0000042C053FA200] GL_INVALID_OPERATION: Texture is immutable. require()
            const textureFlare0 = new THREE.TextureLoader().load('./assets/textures/flares/lensflare0.png');
            const textureFlare3 = new THREE.TextureLoader().load('./assets/textures/flares/lensflare3.png');

            const flareColor = new THREE.Color(0xffaacc);

            const lensFlare = new Lensflare();

            lensFlare.addElement(new LensflareElement(textureFlare0, 350, 0.0, flareColor));
            lensFlare.addElement(new LensflareElement(textureFlare3, 60, 0.6, flareColor));
            lensFlare.addElement(new LensflareElement(textureFlare3, 70, 0.7, flareColor));
            lensFlare.addElement(new LensflareElement(textureFlare3, 120, 0.9, flareColor));
            lensFlare.addElement(new LensflareElement(textureFlare3, 70, 1.0, flareColor));
            spotLight.add(lensFlare);

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
