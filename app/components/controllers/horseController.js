import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { AnimationMixer, SpotLight } from 'three'

const PATH_TO_MODEL = '../../models/Horse.glb'

const WIDTH = 1
const HEIGHT = 1
const DEPTH = 1

const X_POSITION = 100
const Y_POSITION = 0
const Z_POSITION = -100

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
                let model = gltf.scene
                model = this.position(model)
                const mixer = new AnimationMixer(model)

                gltf.animations.forEach(animation => {
                    mixer.clipAction(animation).play()
                })
                model.traverse(obj => {
                    if (obj.isMesh) {
                        obj.castShadow = true
                        obj.material.emissiveIntensity = 1.0
                    }
                })

                const light = new SpotLight(0xffffff, 10);
                light.position.set(100, 100, 100)
                light.target = model
                scene.add(light)

                this.mixer = new AnimationMixer(model) 
                this.mixer.clipAction(gltf.animations[0]).play()
                scene.add(model)
                const update = () => {
                    requestAnimationFrame(update)
                    mixer.update(0.0167)
                }
                update()
            })
        return scene
    }

    position(model) {
        model.scale.set(WIDTH, HEIGHT, DEPTH)
        model.position.set(X_POSITION, Y_POSITION, Z_POSITION)
        model.rotateY(Math.PI)
        return model
    }
}
