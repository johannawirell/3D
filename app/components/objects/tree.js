import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const PATH_TO_TREE = '../models/Tree.glb'
export class Tree {
    constructor(scene, position) {
        this.scene = scene
        this.position = position

        this.#loadTree()
    }

    #loadTree() {
        new GLTFLoader().load(PATH_TO_TREE, gltf => {
            let model = gltf.scene
            model = this.#position(model)
            model.traverse(obj => {
                if (obj.isMesh) {
                    obj.castShadow = true
                }
            })

            this.scene.add(model)
            this.target = gltf.scene
          })
    }

    #position(model) {
        return model
    }
}