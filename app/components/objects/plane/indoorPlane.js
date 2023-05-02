import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const FLOOR = {
    img: '../../img/texture/floor.png',
}

export class IndoorPlane {
    constructor(params) {
        this.scene = params.scene
        this.loadingManager = params.loadingManager
        this.entityManager = params.entityManager
        this.textureLoader = new THREE.CubeTextureLoader(this.loadingManager)
        this.gltfLoader = new GLTFLoader(this.loadingManager)
        this.#createRoom()
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

    #createRoom() {
        this.#createFloor()
        // this.#createWalls()
        this.#position()
        this.#loadContent()
    }

    #createFloor() {
        const floorGeometry = new THREE.PlaneGeometry(window.innerWidth / 8, window.innerHeight / 4)
        const textureLoader = new THREE.TextureLoader()
        const floorTexture = textureLoader.load(FLOOR.img)
        const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture })
        this.plane = new THREE.Mesh(floorGeometry, floorMaterial)
        this.scene.add(this.plane)
    }

    #createWalls() {
        const wallGeometry = new THREE.BoxGeometry(10, 10, 10)
        const wallMaterial = new THREE.MeshBasicMaterial({color: 0xffffff})
        this.walls = new THREE.Mesh(wallGeometry, wallMaterial)
        this.scene.add(this.walls)
    }

    #loadContent() {
        this.gltfLoader.load('', gltf => {})
    }

    #position() {
        this.plane.rotation.x = - Math.PI / 2
        this.plane.position.set(0, 0, 0)


        // this.walls.rotation.y =  Math.PI / 2
        // this.walls.position.x = 5
        // const wall2 = this.walls.clone()
        // wall2.rotation.y = -Math.PI / 2
        // wall2.position.x = -5
        // const wall3 = this.walls.clone()
        // wall3.rotation.y = Math.PI
        // wall3.position.z = 5
        // const wall4 = this.walls.clone()
        // wall4.rotation.y = 0
        // wall4.position.z = -5
        // this.plane.position.y 
    }
}