import * as THREE from 'three'

const IMAGE = '../../img/sky.jpg'

const loader = new THREE.TextureLoader()
export const sky = loader.load(IMAGE)

