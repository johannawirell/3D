import * as THREE from 'three'
const WHITE = 0xffffff

export const ambientLight = new THREE.AmbientLight(WHITE)

export const directionaLight = new THREE.DirectionalLight(WHITE, 1.0)
directionaLight.position.set(-100, 100, 100)
directionaLight.target.position.set(0, 0, 0)
directionaLight.castShadow = true
directionaLight.shadow.bias = -0.001
directionaLight.shadow.mapSize.width = 4096
directionaLight.shadow.mapSize.height = 4096
directionaLight.shadow.camera.near = 0.1
directionaLight.shadow.camera.far = 500.0
directionaLight.shadow.camera.near = 0.5
directionaLight.shadow.camera.far = 500.0
directionaLight.shadow.camera.left = 50
directionaLight.shadow.camera.right = -50
directionaLight.shadow.camera.top = 50
directionaLight.shadow.camera.bottom = -50