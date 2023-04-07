import * as THREE from 'three'
import { Graph } from 'yuka'
import { Forrest } from './nature/forrest'

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

export class Plane {
    radius = 100
    constructor(scene, loadingManager, entityManager) {
        this.scene = scene
        this.loadingManager = loadingManager
        this.textureLoader = new THREE.CubeTextureLoader(this.loadingManager)
        this.entityManager = entityManager
        
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


    #createPlane() {
        const texture = this.#createTextureSkybox()
        this.scene.background = texture

        const planeGeometry = new THREE.PlaneGeometry(
            window.innerWidth * 2,
            window.innerHeight * 2,
            50, 50
        )

        const positions = planeGeometry.attributes.position.array
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i]
    const y = positions[i + 1]
    const z = positions[i + 2]
    positions[i + 2] = Math.sin(x * 0.2) * Math.cos(z * 0.2) * 5
  }
  planeGeometry.computeVertexNormals()

       
        const textureLoader = new THREE.TextureLoader()
        const grassTexture = textureLoader.load(GRASS.texture)
        grassTexture.wrapS = THREE.RepeatWrapping
        grassTexture.wrapT = THREE.RepeatWrapping
        grassTexture.repeat.set(10, 10)
        grassTexture.offset.set(0.5, 0.5)

       

        const material = new THREE.MeshPhongMaterial({
            map: grassTexture,
            shininess: 0,
            specular: 0x222222,
            side: THREE.DoubleSide
        })

        const grassNormalMap = textureLoader.load(GRASS.normalmap)

        material.normalMap = grassNormalMap

        this.plane = new THREE.Mesh(planeGeometry, material)

        this.plane.castShadow = false
        this.plane.receiveShadow = true
        this.#position()

        this.#addTrees()
        this.scene.add(this.plane)   
    }

    #addTrees() {
        new Forrest({
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

