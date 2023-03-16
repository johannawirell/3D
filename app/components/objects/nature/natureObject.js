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

        this.#loadTree()
    }

    #loadTree() {
        const gltfLoader = new GLTFLoader(this.loadingManager)
        gltfLoader.setDRACOLoader(dracoLoader)

        gltfLoader.load(this.glbPath, gltf => {
            let model = gltf.scene
            model = this.#position(model)
            this.getBoundingSphereForGLTF(model)
            this.obstacle = this.createObstacle()

            model.traverse(obj => {
                if (obj.isMesh) {
                    obj.castShadow = true
                }
            })
            model.name = 'Tree'
            this.scene.add(model)
        })
    }

    #position(model) {
        const { scale, x, y, z } = this.position
        model.scale.set(scale, scale, scale)
        model.position.set(x, y, z)
        return model
    }
}
