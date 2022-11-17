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
