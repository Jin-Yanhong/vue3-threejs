import { Stats } from './state';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export function initStats(type) {
    const panelType = typeof type !== 'undefined' && type && !isNaN(type) ? parseInt(type) : 0;
    const stats = new Stats();
    stats.showPanel(panelType); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
    return stats;
}

// export function computeNormalsGroup(group) {
//     if (group instanceof THREE.Mesh) {
//         // TODO:
//         const tempGeom = new THREE.Geometry();
//         tempGeom.fromBufferGeometry(group.geometry);
//         tempGeom.computeFaceNormals();
//         tempGeom.mergeVertices();
//         tempGeom.computeVertexNormals();

//         tempGeom.normalsNeedUpdate = true;

//         // group = new THREE.BufferGeometry();
//         // group.fromGeometry(tempGeom);
//         group.geometry = tempGeom;
//     } else if (group instanceof THREE.Group) {
//         group.children.forEach(function (child) {
//             computeNormalsGroup(child);
//         });
//     }
// }

function setMaterialGroup(material, group) {
    if (group instanceof THREE.Mesh) {
        group.material = material;
    } else if (group instanceof THREE.Group) {
        group.children.forEach(function (child) {
            setMaterialGroup(material, child);
        });
    }
}

export function loadGopher(material) {
    let mesh = null;
    const p = new Promise(function (resolve) {
        new OBJLoader().load('./assets/models/gopher/gopher.obj', function (loadedMesh) {
            mesh = loadedMesh;
            if (material) {
                // computeNormalsGroup(mesh);
                setMaterialGroup(material, mesh);
            }
            resolve(mesh);
        });
    });
    return p;
}

export function addMeshSelection(gui, controls, material, scene) {
    const sphereGeometry = new THREE.SphereGeometry(10, 20, 20);
    const cubeGeometry = new THREE.BoxGeometry(16, 16, 15);
    const planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);

    const sphere = new THREE.Mesh(sphereGeometry, material);
    const cube = new THREE.Mesh(cubeGeometry, material);
    const plane = new THREE.Mesh(planeGeometry, material);

    sphere.position.x = 0;
    sphere.position.y = 11;
    sphere.position.z = 2;
    cube.position.y = 8;
    controls.selectedMesh = 'cube';
    loadGopher(material).then(function (gopher) {
        gopher.scale.x = 5;
        gopher.scale.y = 5;
        gopher.scale.z = 5;
        gopher.position.z = 0;
        gopher.position.x = -10;
        gopher.position.y = 0;
        gui.add(controls, 'selectedMesh', ['cube', 'sphere', 'plane', 'gopher']).onChange(function (e) {
            scene.remove(controls.selected);
            switch (e) {
                case 'cube':
                    scene.add(cube);
                    controls.selected = cube;
                    break;
                case 'sphere':
                    scene.add(sphere);
                    controls.selected = sphere;
                    break;
                case 'plane':
                    scene.add(plane);
                    controls.selected = plane;
                    break;
                case 'gopher':
                    scene.add(gopher);
                    controls.selected = gopher;
                    break;
            }
        });
    });
    controls.selected = cube;
    scene.add(controls.selected);
}

export function addLargeGroundPlane(scene, useTexture) {
    const withTexture = useTexture !== undefined ? useTexture : false;

    // create the ground plane
    const planeGeometry = new THREE.PlaneGeometry(10000, 10000);
    const planeMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff
    });
    if (withTexture) {
        const textureLoader = new THREE.TextureLoader();
        planeMaterial.map = textureLoader.load('../../assets/textures/general/floor-wood.jpg');
        planeMaterial.map.wrapS = THREE.RepeatWrapping;
        planeMaterial.map.wrapT = THREE.RepeatWrapping;
        planeMaterial.map.repeat.set(80, 80);
    }
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    return plane;
}
