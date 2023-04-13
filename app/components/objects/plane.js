import * as THREE from 'three'
import { Forrest } from './nature/forrest'
import { vertexShader, fragmentShader } from './shader'

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

    getObstacles() {
        return this.forrest.getObstacles()
    }

    getSpheres() {
        return this.forrest.getSpheres()
    }

    update(time) {
        this.plane.material.uniforms.time.value = time;
        this.plane.material.uniforms.windStrength.value = Math.sin(time * 0.5) * 0.5 + 0.5;
    }

    #createTextureSkybox() {
        const texture = this.textureLoader.load(SKYBOX)
        return texture
    }

    #createPlaneGeometry() {
        const alphaMap = new THREE.TextureLoader().load(GRASS.texture)
        // Define geometry for instanced planes
        const geometry = new THREE.PlaneGeometry(window.innerWidth * 2, window.innerHeight * 2);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                windStrength: { value: 0.1 },
                alphaMap: { value: alphaMap },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            alphaTest: 0.5,
            side: THREE.DoubleSide,
            transparent: true,
        })
        const plane = new THREE.InstancedMesh(geometry, material)
        const offset = new THREE.Vector3()
        const color = new THREE.Color()
        for (let i = 0; i < 10000; i++) {
            offset.x = Math.random() * 200 - 100
            offset.z = Math.random() * 200 - 100
            plane.setMatrixAt(i, new THREE.Matrix4().setPosition(offset))
            color.setHSL(Math.random() * 0.3 + 0.3, Math.random() * 0.1 + 0.8, Math.random() * 0.1 + 0.5)
            plane.setColorAt(i, color)
        }

        return plane
    }

    #createPlane() {
        const texture = this.#createTextureSkybox()
        this.scene.background = texture
        this.plane = this.#createPlaneGeometry()
        
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

