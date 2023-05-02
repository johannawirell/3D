import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export class IndoorPlane {
    constructor(params) {
        this.scene = params.scene
        this.loadingManager = params.loadingManager
        this.entityManager = params.entityManager
        this.textureLoader = new THREE.CubeTextureLoader(this.loadingManager)
        this.gltfLoader = new GLTFLoader(this.loadingManager)
        this.#createPlane()
    }

    position() {
        return {
            x: this.plane.geometry.parameters.width / 4,
            z: this.plane.geometry.parameters.height / 4
        }
    }

    getObstacles() {
        // return this.forrest.getObstacles()
    }

    getSpheres() {
        // return this.forrest.getSpheres()
    }

    #createPlane() {
        const geometry = new THREE.PlaneGeometry( 5, 5, 10, 10 )
        const material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } )
        this.plane = new THREE.Mesh( geometry, material)
              
        this.scene.add(this.plane)
        this.#loadContent()
    }

    #loadContent() {
        this.gltfLoader.load('', gltf => {})

    }
}