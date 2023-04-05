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
        this.instances = params.instances

        this.#loadTree()
    }

    #loadTree() {
        const gltfLoader = new GLTFLoader(this.loadingManager)
        gltfLoader.setDRACOLoader(dracoLoader)

        gltfLoader.load(this.glbPath, gltf => {
            const model = gltf.scene

            for (let i = 0; i < this.instances; i++) {
                const clone = model.clone()
                this.getBoundingSphereForGLTF(clone)
                this.obstacle = this.createObstacle()

                clone.traverse(obj => {
                    if (obj.isMesh) {
                        obj.castShadow = true
                    }
                })
                clone.name = 'Tree'
                clone.position.set(
                    Math.random() * 100 - 50,
                    Math.random() * 20,
                    Math.random() * 100 - 50
                )

                this.scene.add(clone)
            }
        })
    }

}
