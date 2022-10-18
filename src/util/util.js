import * as THREE from 'three';
import { Stats } from './state';

export function initStats(type) {
    const panelType = typeof type !== 'undefined' && type && !isNaN(type) ? parseInt(type) : 0;
    const stats = new Stats();
    stats.showPanel(panelType); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
    return stats;
}

export function initRenderer(additionalProperties) {
    const props = typeof additionalProperties !== 'undefined' && additionalProperties ? additionalProperties : {};
    const renderer = new THREE.WebGLRenderer(props);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('webgl-output').appendChild(renderer.domElement);

    return renderer;
}

export function initCamera(initialPosition) {
    const position = initialPosition !== undefined ? initialPosition : new THREE.Vector3(-30, 40, 30);
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.copy(position);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    return camera;
}

export function initDefaultLighting(scene, initialPosition) {
    const position = initialPosition !== undefined ? initialPosition : new THREE.Vector3(-10, 30, 40);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.copy(position);
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.camera.fov = 15;
    spotLight.castShadow = true;
    spotLight.decay = 2;
    spotLight.penumbra = 0.05;
    spotLight.name = 'spotLight';

    scene.add(spotLight);

    const ambientLight = new THREE.AmbientLight(0x343434);
    ambientLight.name = 'ambientLight';
    scene.add(ambientLight);
}

export function initDefaultDirectionalLighting(scene, initialPosition) {
    const position = initialPosition !== undefined ? initialPosition : new THREE.Vector3(100, 200, 200);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.copy(position);
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.castShadow = true;

    dirLight.shadow.camera.left = -200;
    dirLight.shadow.camera.right = 200;
    dirLight.shadow.camera.top = 200;
    dirLight.shadow.camera.bottom = -200;

    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0x343434);
    ambientLight.name = 'ambientLight';
    scene.add(ambientLight);
}

export function applyMeshStandardMaterial(geometry, material) {
    if (!material || material.type !== 'MeshStandardMaterial') {
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        material.side = THREE.DoubleSide;
    }

    return new THREE.Mesh(geometry, material);
}

export function applyMeshNormalMaterial(geometry, material) {
    if (!material || material.type !== 'MeshNormalMaterial') {
        material = new THREE.MeshNormalMaterial();
        material.side = THREE.DoubleSide;
    }

    return new THREE.Mesh(geometry, material);
}

export function addDefaultCubeAndSphere(scene) {
    // create a cube
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xff0000,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    // position the cube
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;

    // add the cube to the scene
    scene.add(cube);

    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0x7777ff,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position the sphere
    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;
    sphere.castShadow = true;

    // add the sphere to the scene
    scene.add(sphere);

    return {
        cube: cube,
        sphere: sphere,
    };
}

export function addGroundPlane(scene) {
    // create the ground plane
    const planeGeometry = new THREE.PlaneGeometry(60, 20, 120, 120);
    const planeMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
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

export function addLargeGroundPlane(scene, useTexture) {
    const withTexture = useTexture !== undefined ? useTexture : false;

    // create the ground plane
    const planeGeometry = new THREE.PlaneGeometry(10000, 10000);
    const planeMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
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

export function createGhostTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;

    const ctx = canvas.getContext('2d');
    // the body
    ctx.translate(-81, -84);

    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.moveTo(83, 116);
    ctx.lineTo(83, 102);
    ctx.bezierCurveTo(83, 94, 89, 88, 97, 88);
    ctx.bezierCurveTo(105, 88, 111, 94, 111, 102);
    ctx.lineTo(111, 116);
    ctx.lineTo(106.333, 111.333);
    ctx.lineTo(101.666, 116);
    ctx.lineTo(97, 111.333);
    ctx.lineTo(92.333, 116);
    ctx.lineTo(87.666, 111.333);
    ctx.lineTo(83, 116);
    ctx.fill();

    // the eyes
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(91, 96);
    ctx.bezierCurveTo(88, 96, 87, 99, 87, 101);
    ctx.bezierCurveTo(87, 103, 88, 106, 91, 106);
    ctx.bezierCurveTo(94, 106, 95, 103, 95, 101);
    ctx.bezierCurveTo(95, 99, 94, 96, 91, 96);
    ctx.moveTo(103, 96);
    ctx.bezierCurveTo(100, 96, 99, 99, 99, 101);
    ctx.bezierCurveTo(99, 103, 100, 106, 103, 106);
    ctx.bezierCurveTo(106, 106, 107, 103, 107, 101);
    ctx.bezierCurveTo(107, 99, 106, 96, 103, 96);
    ctx.fill();

    // the pupils
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(101, 102, 2, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(89, 102, 2, 0, Math.PI * 2, true);
    ctx.fill();

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

export function addSpecificMaterialSettings(gui, controls, material, name) {
    controls.material = material;

    const folderName = name !== undefined ? name : 'THREE.' + material.type;
    const folder = gui.addFolder(folderName);
    switch (material.type) {
        case 'MeshNormalMaterial':
            folder.add(controls.material, 'wireframe');
            return folder;

        case 'MeshPhongMaterial':
            controls.specular = material.specular.getStyle();
            folder.addColor(controls, 'specular').onChange(function (e) {
                material.specular.setStyle(e);
            });
            folder.add(material, 'shininess', 0, 100, 0.01);
            return folder;

        case 'MeshStandardMaterial':
            controls.color = material.color.getStyle();
            folder.addColor(controls, 'color').onChange(function (e) {
                material.color.setStyle(e);
            });
            controls.emissive = material.emissive.getStyle();
            folder.addColor(controls, 'emissive').onChange(function (e) {
                material.emissive.setStyle(e);
            });
            folder.add(material, 'metalness', 0, 1, 0.01);
            folder.add(material, 'roughness', 0, 1, 0.01);
            folder.add(material, 'wireframe');

            return folder;
    }
}

export function redrawGeometryAndUpdateUI(gui, scene, controls, geomFunction) {
    guiRemoveFolder(gui, controls.specificMaterialFolder);
    guiRemoveFolder(gui, controls.currentMaterialFolder);
    if (controls.mesh) scene.remove(controls.mesh);
    const changeMat = eval('(' + controls.appliedMaterial + ')');
    if (controls.mesh) {
        controls.mesh = changeMat(geomFunction(), controls.mesh.material);
    } else {
        controls.mesh = changeMat(geomFunction());
    }

    controls.mesh.castShadow = controls.castShadow;
    scene.add(controls.mesh);
    controls.currentMaterialFolder = addBasicMaterialSettings(gui, controls, controls.mesh.material);
    controls.specificMaterialFolder = addSpecificMaterialSettings(gui, controls, controls.mesh.material);
}

export function guiRemoveFolder(gui, folder) {
    if (folder && folder.name && gui.__folders[folder.name]) {
        gui.__folders[folder.name].close();
        gui.__folders[folder.name].domElement.parentNode.parentNode.removeChild(gui.__folders[folder.name].domElement.parentNode);
        delete gui.__folders[folder.name];
        gui.onResize();
    }
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

export function setMaterialGroup(material, group) {
    if (group instanceof THREE.Mesh) {
        group.material = material;
    } else if (group instanceof THREE.Group) {
        group.children.forEach(function (child) {
            setMaterialGroup(material, child);
        });
    }
}
