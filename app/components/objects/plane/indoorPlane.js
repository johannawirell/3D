import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const FLOOR = {
    img: '../../img/texture/floor.png',
}

export class IndoorPlane {
    wallThickness = 0.1
    constructor(params) {
        this.scene = params.scene
        this.loadingManager = params.loadingManager
        this.entityManager = params.entityManager
        this.textureLoader = new THREE.TextureLoader(this.loadingManager)
        this.gltfLoader = new GLTFLoader(this.loadingManager)
        this.walls = []
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
        this.#createWalls()
        this.#position()
        // this.#loadContent()
    }

    #createFloor() {
        const floorGeometry = new THREE.PlaneGeometry(window.innerWidth / 8, window.innerHeight / 4)
        const floorTexture = this.textureLoader.load(FLOOR.img)
        const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture })
        this.plane = new THREE.Mesh(floorGeometry, floorMaterial)
        this.scene.add(this.plane)
    }

    #createWalls() {
        const { width, height } = this.plane.geometry.parameters

        const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
        const wallHeight = height / 2
        const wallThickness = 0.1
        
        const leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, height)
        const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial)
        leftWall.position.set(-width / 2, wallHeight / 2, 0)
        
        const rightWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, height)
        const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial)
        rightWall.position.set(width / 2, wallHeight / 2, 0)
        
        const frontWallGeometry = new THREE.BoxGeometry(width, wallHeight, wallThickness)
        const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial)
        frontWall.position.set(0, wallHeight / 2, -height / 2)
        
        const backWallGeometry = new THREE.BoxGeometry(width, wallHeight, wallThickness)
        const backWall = new THREE.Mesh(backWallGeometry, wallMaterial)
        backWall.position.set(0, wallHeight / 2, height / 2)
        
        // add walls to scene
        const walls = [leftWall, rightWall, frontWall, backWall]
        walls.forEach(wall => this.scene.add(wall))
        
    }

    #loadContent() {
        this.gltfLoader.load('', gltf => {})
    }

    #position() {
        this.plane.rotation.x = - Math.PI / 2
        this.plane.position.set(0, 0, 0)
    }
}