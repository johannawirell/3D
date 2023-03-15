import * as THREE from 'three'
import { NatureObject } from './nature/natureObject'

const TREES = [ 
    '../../../models/Oak.glb',
    '../../../models/Pine.glb'
]

const SKYBOX = [
    '../../img/skybox/posx.jpg',
    '../../img/skybox/negx.jpg',
    '../../img/skybox/posy.jpg',
    '../../img/skybox/negy.jpg',
    '../../img/skybox/posz.jpg',
    '../../img/skybox/negz.jpg',  
]

export class Plane {
    numberOfTrees = 150
    constructor(scene, loadingManager) {
        this.scene = scene
        this.loadingManager = loadingManager
        this.textureLoader = new THREE.CubeTextureLoader(this.loadingManager)
        
        this.#createPlane()
    }

    get position () {
        return {
            x: this.plane.geometry.parameters.width / 4,
            z: this.plane.geometry.parameters.height / 4
        }
    }

    #createTextureSkybox() {
        const texture = this.textureLoader.load(SKYBOX)
        return texture
    }

    #createTexturePlane() {
        const texture = new THREE.TextureLoader(this.loadingManager).load(SKYBOX[3])
        texture.wrapS = THREE.MirroredRepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        
        texture.repeat.set(50, 50)
        return texture
    }

    #createPlane() {
        const texture = this.#createTextureSkybox()
        this.scene.background = texture
        this.plane = new THREE.Mesh(
            new THREE.PlaneGeometry(
                window.innerWidth * 2,
                window.innerHeight * 2,
            ),
            new THREE.MeshBasicMaterial( { map: this.#createTexturePlane() })
        )
        
        this.plane.castShadow = false
        this.plane.receiveShadow = true
        this.#position()

        this.#addTrees()
        this.scene.add(this.plane)    
    }

    #addTrees() {
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
       
        for (let i = 0; i < this.numberOfTrees; i++) {
            const treeToCreate = this.#randomTree()
            let scale
            if (treeToCreate === TREES[0]) {
                scale = this.#generateRandomNumber(5,8)
            } else if (treeToCreate === TREES[1]) {
                scale = this.#generateRandomNumber(4,6)
            } else if (treeToCreate === TREES[2]) {
                
            }
            new NatureObject(
                treeToCreate,
                this.scene,
                this.loadingManager,
                { 
                    scale: scale,
                    x: this.#generateRandomNumber(-windowWidth, windowWidth),
                    y: this.#generateRandomNumber(1, 0),
                    z: this.#generateRandomNumber(-windowHeight, windowHeight)
                }
            )
        }
    }

    #randomTree() {
        const randomIndex = Math.floor(Math.random() * TREES.length)
        const tree = TREES[randomIndex]

        return tree
    }

    #generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    #position() {
        this.plane.rotation.x = - Math.PI / 2
        this.plane.position.set(0, 0, 0)

    }
}

