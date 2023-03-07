import * as THREE from 'three'
const WHITE = 0xffffff

export const pointLight = new THREE.PointLight(WHITE)
pointLight.position.set(5, 5, 5)

export const ambientLight = new THREE.AmbientLight(WHITE)

export const light = new THREE.DirectionalLight(0xFFFFFF);
light.position.set(20, 100, 10);
light.target.position.set(0, 0, 0);
light.castShadow = true;
light.shadow.bias = -0.001;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 500.0;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500.0;
light.shadow.camera.left = 100;
light.shadow.camera.right = -100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;

export const lightHelper = new THREE.PointLightHelper(pointLight)