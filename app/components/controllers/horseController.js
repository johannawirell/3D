import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
const PATH_TO_MODEL = '../../models/Horse.glb'

const WIDTH = 0.2
const HEIGHT = 0.2
const DEPTH = 0.2

export class HorseController {
    constructor() {
        this.pressedKeys = {}
        this.addEventListeners()
    }

    addEventListeners() {

    }

    addHorseTo(scene) {
        new GLTFLoader()
            .load(PATH_TO_MODEL, gltf => {
                const model = gltf.scene
                model.scale.set(WIDTH, HEIGHT, DEPTH)
                model.traverse(obj => {
                    if (obj.isMesh) {
                        obj.castShadow = true
                    }
                })
                scene.add(model)
            })
        return scene
    }
}
