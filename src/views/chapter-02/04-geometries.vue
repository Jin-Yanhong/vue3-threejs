<template>
    <div class="view" ref="containerRef"></div>
</template>
<script>
import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import {ConvexGeometry} from 'three/examples/jsm/geometries/ConvexGeometry';
import {ParametricGeometries} from 'three/examples/jsm/geometries/ParametricGeometries';
import {ParametricGeometry} from 'three/examples/jsm/geometries/ParametricGeometry';
import {createMultiMaterialObject} from 'three/examples/jsm/utils/SceneUtils';
import {defineComponent, ref} from 'vue';

export default defineComponent({
    setup() {
        const containerRef = ref();
        const scene = new THREE.Scene();
        const WebGLRenderer = new THREE.WebGLRenderer();
        return {
            containerRef,
            scene,
            WebGLRenderer
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
            const innerWidth = window.innerWidth - 300;
            const innerHeight = window.innerHeight;

            const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);

            camera.position.x = -40;
            camera.position.y = 20;
            camera.position.z = 40;
            camera.lookAt(this.scene.position);

            this.WebGLRenderer.setClearColor(new THREE.Color(0x000000));
            this.WebGLRenderer.setSize(innerWidth, innerHeight);
            this.WebGLRenderer.shadowMap.enabled = true;

            const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
            const planeMaterial = new THREE.MeshLambertMaterial({
                color: 0xffffff
            });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.receiveShadow = true;
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.x = 0;
            plane.position.y = 0;
            plane.position.z = 0;
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

            this.addGeometries();
            const trackballControls = new TrackballControls(camera, this.WebGLRenderer.domElement);
            const clock = new THREE.Clock();

            const renderScene = () => {
                trackballControls.update(clock.getDelta());
                requestAnimationFrame(renderScene);
                this.WebGLRenderer.render(this.scene, camera);
            };
            renderScene();
        },
        depose() {
            this.WebGLRenderer.dispose();
        },

        addGeometries() {
            const geoms = [];
            geoms.push(new THREE.CylinderGeometry(1, 4, 4));

            // basic cube
            geoms.push(new THREE.BoxGeometry(2, 2, 2));

            // basic spherer
            geoms.push(new THREE.SphereGeometry(2));
            geoms.push(new THREE.IcosahedronGeometry(4));

            // create a convex shape (a shape without dents)
            // using a couple of points
            // for instance a cube
            const points = [new THREE.Vector3(2, 2, 2), new THREE.Vector3(2, 2, -2), new THREE.Vector3(-2, 2, -2), new THREE.Vector3(-2, 2, 2), new THREE.Vector3(2, -2, 2), new THREE.Vector3(2, -2, -2), new THREE.Vector3(-2, -2, -2), new THREE.Vector3(-2, -2, 2)];
            geoms.push(new ConvexGeometry(points));

            // create a lathgeometry
            // http://en.wikipedia.org/wiki/Lathe_(graphics)
            const pts = []; // points array - the path profile points will be stored here
            const detail = 0.1; // half-circle detail - how many angle increments will be used to generate points
            const radius = 3; // radius for half_sphere

            for (let angle = 0.0; angle < Math.PI; angle += detail) {
                // loop from 0.0 radians to PI (0 - 180 degrees)
                pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)); // angle/radius to x,z
            }
            geoms.push(new THREE.LatheGeometry(pts, 12));
            geoms.push(new THREE.OctahedronGeometry(3));
            geoms.push(new ParametricGeometry(ParametricGeometries.mobius3d, 20, 10));
            geoms.push(new THREE.TetrahedronGeometry(3));
            geoms.push(new THREE.TorusGeometry(3, 1, 10, 10));
            geoms.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20));

            let j = 0;
            for (let i = 0; i < geoms.length; i++) {
                const cubeMaterial = new THREE.MeshLambertMaterial({
                    wireframe: true,
                    color: Math.random() * 0xffffff
                });

                const materials = [
                    new THREE.MeshLambertMaterial({
                        color: Math.random() * 0xffffff
                    }),
                    new THREE.MeshBasicMaterial({
                        color: 0x000000,
                        wireframe: true
                    }),
                    cubeMaterial
                ];

                const mesh = createMultiMaterialObject(geoms[i], materials);
                mesh.traverse(function(e) {
                    e.castShadow = true;
                });

                // let mesh = new THREE.Mesh(geoms[i],materials[i]);
                // mesh.castShadow=true;
                mesh.position.x = -24 + (i % 4) * 12;
                mesh.position.y = 4;
                mesh.position.z = -8 + j * 12;

                if ((i + 1) % 4 == 0) j++;
                this.scene.add(mesh);
            }
        }
    }
});
</script>
<style lang="scss" scoped></style>
