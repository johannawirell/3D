import * as THREE from 'three'
const IMAGE = '../img/Tindra.jpg'
const WIDTH = 10
const HIEGHT = 10
const DEPTH = 10

const texture = new THREE.TextureLoader().load(IMAGE)

export const tindra = new THREE.Mesh(
    new THREE.BoxGeometry(
        WIDTH,
        HIEGHT,
        DEPTH
    ),
    new THREE.MeshBasicMaterial( { map: texture })
)