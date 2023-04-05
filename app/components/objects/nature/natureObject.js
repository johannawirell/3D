import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GameEnity } from '../../controllers/gameEnity/gameEnity'

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/')

export class NatureObject extends GameEnity {
    constructor(params) {
        super(params)
        this.glbPath = params.glbPath
        this.loadingManager = params.loadingManager
        this.entityManager = params.entityManager
        this.position = params.position

        this.modelPromise = this.#loadTree()
    }

    #loadTree() {
        return new Promise((resolve, reject) => {
            const gltfLoader = new GLTFLoader(this.loadingManager)
            gltfLoader.setDRACOLoader(dracoLoader)

            gltfLoader.load(this.glbPath, gltf => {
                this.model = gltf.scene
                this.model = this.#position()
                this.getBoundingSphereForGLTF(this.model)
                this.obstacle = this.createObstacle()
                this.model.name = 'Tree'

                this.model.traverse(obj => {    
                    if (obj.isMesh) {
                        obj.castShadow = true
                    }
                })
                resolve(this.model)
                // this.scene.add(this.model)
            }, undefined, reject)
        })
    }

    async getModel() {
        return await this.modelPromise
    }

    #position() {
        const { scale, x, y, z } = this.position
        this.model.scale.set(scale, scale, scale)
        this.model.position.set(x, y, z)
        return this.model
    }
}
