import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const PATH_TO_HORSE = '../../models/Horse.glb'
const WIDTH = 0.4
const HEIGHT = 0.4
const DEPTH = 0.4

const X_POSITION = 100
const Y_POSITION = 0
const Z_POSITION = -100

export class HorseController {
    constructor(camera, scene) {
        this.camera = camera
        this.scene = scene

        this.#loadHorseModel()
    }

    #loadHorseModel() {
        new GLTFLoader().load(PATH_TO_HORSE, gltf => {
            let model = gltf.scene
            model = this.#updateInitialPosition(model)
            model.traverse(obj => {
                if (obj.isMesh) {
                    obj.castShadow = true
                }
            })
            this.scene.add(model)

            const gltfAnimation = gltf.animations[0]
            this.mixer = new THREE.AnimationMixer(model)
            const action = this.mixer.clipAction(gltfAnimation)
            action.play()

            this.target = gltf.scene
          })
    }

    update(time) {
        if (this.mixer) {
            this.mixer.update(time)
        }
    }

   #updateInitialPosition(model) {
        if (model) {
            model.scale.set(WIDTH, HEIGHT, DEPTH)
            model.position.set(X_POSITION, Y_POSITION, Z_POSITION)
            model.rotateY(Math.PI)
        }
        return model
    }
}
