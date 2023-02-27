import * as THREE from 'three'
const WHITE = 0xffffff

export const pointLight = new THREE.PointLight(WHITE)
pointLight.position.set(5, 5, 5)
pointLight.intensity = 2

export const ambientLight = new THREE.AmbientLight(WHITE)
ambientLight.intensity = 2
export const lightHelper = new THREE.PointLightHelper(pointLight)