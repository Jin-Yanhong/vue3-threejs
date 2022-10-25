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
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        const trackballControls = new TrackballControls(camera, WebGLRenderer.domElement);
        const gui = new dat.GUI();
        const stats = initStats();
        const clock = new THREE.Clock();
        return {
            containerRef,
            scene,
            WebGLRenderer,
            gui,
            trackballControls,
            camera,
            stats,
            clock
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
            const innerWidth = window.innerWidth - 300;
            const innerHeight = window.innerHeight;

            this.camera.position.x = 120;
            this.camera.position.y = 60;
            this.camera.position.z = 180;
            this.camera.lookAt(this.scene.position);

            this.WebGLRenderer.setClearColor(new THREE.Color(0x000000));
            this.WebGLRenderer.setSize(innerWidth, innerHeight);
            this.WebGLRenderer.shadowMap.enabled = true;

            const planeGeometry = new THREE.PlaneGeometry(180, 180);
            const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.x = 0;
            plane.position.y = 0;
            plane.position.z = 0;
            this.scene.add(plane);

            const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
            for (let j = 0; j < planeGeometry.parameters.height / 5; j++) {
                for (let i = 0; i < planeGeometry.parameters.width / 5; i++) {
                    const rnd = Math.random() * 0.75 + 0.25;
                    const cubeMaterial = new THREE.MeshLambertMaterial();
                    cubeMaterial.color = new THREE.Color(rnd, 0, 0);
                    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    cube.position.z = -(planeGeometry.parameters.height / 2) + 2 + j * 5;
                    cube.position.x = -(planeGeometry.parameters.width / 2) + 2 + i * 5;
                    cube.position.y = 2;
                    this.scene.add(cube);
                }
            }

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
            directionalLight.position.set(-20, 40, 60);
            this.scene.add(directionalLight);

            const spotLight = new THREE.SpotLight(0xffffff, 1.2, 150, 120);
            spotLight.position.set(-40, 60, -10);
            spotLight.castShadow = true;
            this.scene.add(spotLight);
            spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
            this.scene.add(spotLight);

            const ambienLight = new THREE.AmbientLight(0x353535);
            this.scene.add(ambienLight);

            this.WebGLRenderer.render(this.scene, this.camera);
            this.containerRef.appendChild(this.WebGLRenderer.domElement);

            const _this = this;

            const controls = {
                perspective: 'Perspective',

                switchCamera: function () {
                    if (_this.camera instanceof THREE.PerspectiveCamera) {
                        _this.camera = new THREE.OrthographicCamera(window.innerWidth / -16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, -200, 500);
                        _this.camera.position.x = 120;
                        _this.camera.position.y = 60;
                        _this.camera.position.z = 180;
                        _this.camera.lookAt(_this.scene.position);
                        _this.trackballControls = _this.initTrackballControls(_this.camera, _this.WebGLRenderer);
                        this.perspective = 'Orthographic';
                    } else {
                        _this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
                        _this.camera.position.x = 120;
                        _this.camera.position.y = 60;
                        _this.camera.position.z = 180;
                        _this.camera.lookAt(_this.scene.position);
                        _this.trackballControls = _this.initTrackballControls(_this.camera, _this.WebGLRenderer);
                        this.perspective = 'Perspective';
                    }
                }
            };

            this.gui.add(controls, 'switchCamera');
            this.gui.add(controls, 'perspective').listen();

            this.renderScene();
        },
        depose () {
            this.WebGLRenderer.dispose();
            this.gui.destroy();
            const panelGroup = document.querySelector('#panelGroup');
            document.body.removeChild(panelGroup);
            this.trackballControls.dispose();
        },
        initTrackballControls (camera, renderer) {
            const trackballControls = new TrackballControls(camera, renderer.domElement);
            trackballControls.rotateSpeed = 1.0;
            trackballControls.zoomSpeed = 1.2;
            trackballControls.panSpeed = 0.8;
            trackballControls.noZoom = false;
            trackballControls.noPan = false;
            trackballControls.staticMoving = true;
            trackballControls.dynamicDampingFactor = 0.3;
            trackballControls.keys = [65, 83, 68];
            return trackballControls;
        },
        renderScene () {
            this.trackballControls.update(this.clock.getDelta());
            this.stats.update();
            requestAnimationFrame(this.renderScene);
            this.WebGLRenderer.render(this.scene, this.camera);
        }
    }
});
</script>
<style lang="scss" scoped></style>
