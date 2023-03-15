import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/')

export class NatureObject {
    constructor(params) {
        this.glbPath = params.glbPath
        this.scene = params.scene
        this.loadingManager = params.loadingManager
        this.entityManager = params.entityManager
        this.position = params.position
        

        this.#loadTree()
        this.#createObstacle()
    }

    #loadTree() {
        const gltfLoader = new GLTFLoader(this.loadingManager)
        gltfLoader.setDRACOLoader(dracoLoader)

        gltfLoader.load(this.glbPath, gltf => {
            let model = gltf.scene
            model = this.#position(model)
            model.traverse(obj => {
                if (obj.isMesh) {
                    obj.castShadow = true
                }
            })
            model.name = 'Tree'
            this.target = model
            this.#createObstacle()
            this.scene.add(model)
            
        })
    }

    #position(model) {
        const { scale, x, y, z } = this.position
        model.scale.set(scale, scale, scale)
        model.position.set(x, y, z)
        return model
    }

    #createObstacle() {
        if (this.target) {
            console.log(this.target)
            console.log('target')
        }
    }
}
