import * as THREE from 'three'
import { Door } from '../house/door'
import { Interior } from '../house/interior'

const RESOURCES = {
    floor: '../../img/texture/floor.png',
    carpet: '../../img/texture/carpet.png'
}


export class IndoorPlane {
    wallThickness = 50
    constructor(params) {
        this.scene = params.scene
        this.loadingManager = params.loadingManager
        this.entityManager = params.entityManager
        this.textureLoader = new THREE.TextureLoader(this.loadingManager)
        this.walls = []
        this.#createRoom()
    }

    position() {
        return {
            x: this.plane.geometry.parameters.width / 4,
            z: this.plane.geometry.parameters.height / 4
        }
    }

    getDoorPosition() {
        // return this.door.position
    }

    getComputerPosition() {
        return this.interior.getComputerPosition()
    }

    getSpheres() {
        return this.interior.getSpheres()
    }

    update(time) {
        if (this.door) {
            this.door.update(time)
        }
    }

    #createRoom() {
        this.#createFloor()
        this.#createCarpet()
        this.#createWalls()
        this.#position()
        this.#loadContent()
    }

    #createFloor() {
        const floorGeometry = new THREE.PlaneGeometry(80, 100)
        const floorTexture = this.textureLoader.load(RESOURCES.floor)
        const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture })
        this.plane = new THREE.Mesh(floorGeometry, floorMaterial)
        this.scene.add(this.plane)
    }

    #createCarpet() {
        const planeGeometry = new THREE.PlaneGeometry(50, 50)
        const textureLoader = new THREE.TextureLoader(this.loadingManager)
        const texture = textureLoader.load(RESOURCES.carpet)
        const material = new THREE.MeshBasicMaterial({ map: texture })
        const planeMesh = new THREE.Mesh(planeGeometry, material)

        planeMesh.position.set(0, 0.1, 0)
        planeMesh.rotation.x = -Math.PI / 2

        this.scene.add(planeMesh)
    }

    #createWalls() {
        const { width, height } = this.plane.geometry.parameters
        
        const wallHeight = height / 2
        const wallThickness = 5
        
        const leftWall = this.createWall(-width / 2, wallHeight / 2, 0, wallThickness, wallHeight, height, 0xC7C6C5)
        const rightWall = this.createWall(width / 2, wallHeight / 2, 0, wallThickness, wallHeight, height, 0x727272)
        const frontWall = this.createWall(0, wallHeight / 2, -height / 2, width, wallHeight, wallThickness, 0x7A7474)
        const backWall = this.createWall(0, wallHeight / 2, height / 2, width, wallHeight, wallThickness, 0xBDBDBD)
        
        const walls = [leftWall, rightWall, frontWall, backWall]
        walls.forEach(wall => this.scene.add(wall))
    }
        
    createWall(x, y, z, width, height, depth, color) {
        const wallMaterial = new THREE.MeshStandardMaterial({ color: color })
        const wallGeometry = new THREE.BoxGeometry(width, height, depth)
        const wall = new THREE.Mesh(wallGeometry, wallMaterial)
        wall.position.set(x, y, z)
        wall.castShadow = true
        return wall
    }

    async #loadContent() {
        // this.door = new Door({
        //     entityManager: this.entityManager,
        //     camera: this.camera,
        //     scene: this.scene
        // })


        this.interior = new Interior({
            entityManager: this.entityManager,
            loadingManager: this.loadingManager,
            scene: this.scene
        })
    }

    #position() {
        this.plane.rotation.x = - Math.PI / 2
        this.plane.position.set(0, 0, 0)
    }
}