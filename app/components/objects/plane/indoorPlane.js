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
        
        const wallHeight = height / 2
        const wallThickness = 0.1
        
        const leftWall = this.createWall(-width / 2, wallHeight / 2, 0, wallThickness, wallHeight, height)
        const rightWall = this.createWall(width / 2, wallHeight / 2, 0, wallThickness, wallHeight, height)
        const frontWall = this.createWall(0, wallHeight / 2, -height / 2, width, wallHeight, wallThickness)
        const backWall = this.createWall(0, wallHeight / 2, height / 2, width, wallHeight, wallThickness)
        
        const shadowBoxes = this.createShadowBoxes(width, height, wallHeight)
        
        const walls = [leftWall, rightWall, frontWall, backWall]
        walls.forEach(wall => this.scene.add(wall))
        shadowBoxes.forEach(box => this.scene.add(box))
    }
        
    createWall(x, y, z, width, height, depth) {
        const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
        const wallGeometry = new THREE.BoxGeometry(width, height, depth)
        const wall = new THREE.Mesh(wallGeometry, wallMaterial)
        wall.position.set(x, y, z)
        wall.castShadow = true
        return wall
    }
        
    createShadowBoxes(width, height, wallHeight) {
        const boxSize = 0.05
        const shadowBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.3, transparent: true })
        const shadowBoxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize)
        
        const shadowBoxes = [
            this.createShadowBox(-width / 2 + boxSize / 2, wallHeight - boxSize / 2, -height / 2 + boxSize / 2, shadowBoxGeometry, shadowBoxMaterial),
            this.createShadowBox(-width / 2 + boxSize / 2, wallHeight - boxSize / 2, height / 2 - boxSize / 2, shadowBoxGeometry, shadowBoxMaterial),
            this.createShadowBox(width / 2 - boxSize / 2, wallHeight - boxSize / 2, -height / 2 + boxSize / 2, shadowBoxGeometry, shadowBoxMaterial),
            this.createShadowBox(width / 2 - boxSize / 2, wallHeight - boxSize / 2, height / 2 - boxSize / 2, shadowBoxGeometry, shadowBoxMaterial),
        ]
        return shadowBoxes
    }
        
    createShadowBox(x, y, z, geometry, material) {
        const shadowBox = new THREE.Mesh(geometry, material)
        shadowBox.position.set(x, y, z)
        return shadowBox
    }

    #loadContent() {
        this.gltfLoader.load('', gltf => {})
    }

    #position() {
        this.plane.rotation.x = - Math.PI / 2
        this.plane.position.set(0, 0, 0)
    }
}