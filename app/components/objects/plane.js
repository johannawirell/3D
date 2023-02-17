import * as THREE from 'three'

const WIDTH = 200
const HIEGHT = 200
const IMAGE = '../../img/plane.jpg'

const texture = new THREE.TextureLoader().load(IMAGE)

export const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(
        WIDTH,
        HIEGHT
    ),
    new THREE.MeshBasicMaterial( { map: texture })
)

plane.rotation.x = -Math.PI / 2 // Rotate 90°
plane.position.set(0, 0, 0)
