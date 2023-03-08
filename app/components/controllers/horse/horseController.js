import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Movement } from './movement'

const PATH_TO_HORSE = '../../models/Horse.glb'
const WIDTH = 0.4
const HEIGHT = 0.4
const DEPTH = 0.4

const X_POSITION = -5
const Y_POSITION = 0
const Z_POSITION = -100

export class HorseController {
    velocity = new THREE.Vector3(0, 0, 2)
    currentPosition = new THREE.Vector3()

    constructor(camera, scene) {
        this.camera = camera
        this.scene = scene

        this.movement = new Movement()

        this.#loadHorseModel()
    }

    get position() {
        return this.currentPosition
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

    #move(time) {
        if (this.target) {
            const newPosition = this.movement.move(time, this.target)
            this.target.position.copy(newPosition)
        }
    }
    
    update(time) {
        if (this.mixer) {
            this.mixer.update(time)
        }
    
        this.#move(time)
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
