import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/')

export class NatureObject {
    constructor(glbPath, scene, loadingManager, entityManager, position) {
        this.glbPath = glbPath
        this.scene = scene
        this.loadingManager = loadingManager
        this.position = position
        this.entityManager = entityManager

        this.#loadTree()
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

            this.scene.add(model)
            this.target = gltf.scene
        })
    }

    #position(model) {
        const { scale, x, y, z } = this.position
        model.scale.set(scale, scale, scale)
        model.position.set(x, y, z)
        return model
    }
}
