import * as THREE from 'three'

const IMAGE = '../../img/plane.jpg'

const texture = new THREE.TextureLoader().load(IMAGE)
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping 
texture.repeat.set(40, 20)

export const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(
        window.innerWidth,
        window.innerHeight,


    ),
    new THREE.MeshBasicMaterial( { map: texture })
)

plane.rotation.x = -Math.PI / 2 // Rotate 90°
plane.position.set(0, 0, 0)
// plane.scale.normalize().multiplyScalar(1)
