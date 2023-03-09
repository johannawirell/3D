import * as THREE from 'three'

const IMAGES = [
    'negx.jpg',
    'negy.jpg',
    'negz.jpg',
    'posx.jpg',
    'posy.jpg',
    'posz.jpg'
]

export class Meadow {
    constructor(scene) {
        this.scene = scene

        this.#createTexture()
    }

    #createTexture() {
        let materials = []
        for (let i = 0; i < IMAGES.length; i++) {
            const texture = new THREE.TextureLoader().load('../../img/Meadow/' + IMAGES[i])
            materials.push(new THREE.MeshBasicMaterial({ map: texture }))
        }

        materials = this.#position(materials)

        this.#createSkybox(materials)
    }

    #position(materials) {
        for (let i = 0; i < IMAGES.length; i++) {
            materials[i].side = THREE.BackSide
        }
        return materials
    }

    #createSkybox(materials) {
        const skyBoxGeometry = new THREE.BoxGeometry(window.innerWidth, window.innerHeight, 100)
        const skyBox = new THREE.Mesh(skyBoxGeometry, materials)
    
        this.scene.add(skyBox)
    }
}