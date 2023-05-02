import * as THREE from 'three'
import { Forrest } from '../nature/forrest'
const SKYBOX = [
    '../../img/skybox/posx.jpg',
    '../../img/skybox/negx.jpg',
    '../../img/skybox/posy.jpg',
    '../../img/skybox/negy.jpg',
    '../../img/skybox/posz.jpg',
    '../../img/skybox/negz.jpg',  
]

const GRASS = {
    ao: '../../img/grass/grass-ao.png',
    heightmap: '../../img/grass/grass-heightmap.png',
    normalmap: '../../img/grass/grass-normalmap.png',
    roughness: '../../img/grass/grass-roughness.png',
    texture: '../../img/grass/grass-texture.png',
}

export class OutdoorPlane {
    constructor(params) {
        this.scene = params.scene
        this.loadingManager = params.loadingManager
        this.entityManager = params.entityManager
        this.textureLoader = new THREE.CubeTextureLoader(this.loadingManager)
        this.#createPlane()
    }

    position() {
        return {
            x: this.plane.geometry.parameters.width / 4,
            z: this.plane.geometry.parameters.height / 4
        }
    }

    getObstacles() {
        return this.forrest.getObstacles()
    }

    getSpheres() {
        return this.forrest.getSpheres()
    }

    #createTextureSkybox() {
        const texture = this.textureLoader.load(SKYBOX)
        return texture
    }

    #createPlaneGeometry() {
        const planeGeometry = new THREE.PlaneGeometry(window.innerWidth * 2, window.innerHeight * 2)
       
        const textureLoader = new THREE.TextureLoader()
        const grassTexture = textureLoader.load(GRASS.texture)
        grassTexture.wrapS = THREE.RepeatWrapping
        grassTexture.wrapT = THREE.RepeatWrapping
        grassTexture.repeat.set(20, 10)
        grassTexture.offset.set(0.8, 0.8)

        const material = new THREE.MeshPhongMaterial({
            map: grassTexture,
            shininess: 0,
            specular: 0x222222,
            side: THREE.DoubleSide,
        })

        const grassNormalMap = textureLoader.load(GRASS.normalmap)

        material.normalMap = grassNormalMap

        this.plane = new THREE.Mesh(planeGeometry, material)

        this.plane.castShadow = false
        this.plane.receiveShadow = true
    }

    #createPlane() {
        const texture = this.#createTextureSkybox()
        this.scene.background = texture
        this.#createPlaneGeometry()
        
        this.#position()

        this.#addTrees()
        this.scene.add(this.plane)
    }

    #addTrees() {
        this.forrest = new Forrest({
            scene: this.scene,
            loadingManager: this.loadingManager,
            entityManager: this.entityManager
        })     
    }

    #position() {
        this.plane.rotation.x = - Math.PI / 2
        this.plane.position.set(0, 0, 0)
    }
}