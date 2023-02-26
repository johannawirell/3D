import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { AnimationMixer } from 'three'

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
                const mixer = new AnimationMixer(model)

                gltf.animations.forEach(animation => {
                    mixer.clipAction(animation).play()
                })
                model.traverse(obj => {
                    if (obj.isMesh) {
                        obj.castShadow = true
                    }
                })
                this.mixer = new AnimationMixer(model) 
                this.mixer.clipAction(gltf.animations[0]).play()
                scene.add(model)
                const update = () => {
                    requestAnimationFrame(update)
                    mixer.update(0.0167) // Delta tid för varje frame
                }
                update()
                })
        return scene
  
    }
}
