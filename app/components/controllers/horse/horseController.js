import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Movement } from './movement'

const PATH_TO_HORSE = '../../models/Daffy.glb'
const WIDTH = 0.4
const HEIGHT = 0.4
const DEPTH = 0.4

const X_POSITION = -5
const Y_POSITION = 0
const Z_POSITION = -100

const WALK_STATE = 'Walk'
const IDLE_STATE = 'Idle'

export class HorseController {
    velocity = new THREE.Vector3(0, 0, 2)
    currentPosition = new THREE.Vector3(X_POSITION, Y_POSITION, Z_POSITION)

    constructor(camera, scene) {
        this.animationsMap = new Map()
        this.camera = camera
        this.scene = scene
        this.move = true
        this.currentState = WALK_STATE
        this.movement = new Movement()

        this.#loadHorseModel()
    }

    get position() {
        return this.currentPosition
    }

    stopMovement() {
        this.move = false
    }

    startMovement() {
        this.move = true
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

            this.gltfAnimation = gltf.animations

            this.mixer = new THREE.AnimationMixer(model)
            for (const action of this.gltfAnimation) {
                this.animationsMap.set(action.name, this.mixer.clipAction(action))
            }

            this.target = gltf.scene
          })
    }

    #move(time) {
        if (this.target) {
            const toPlay = this.animationsMap.get(this.currentState)
            const newPosition = this.movement.move(time, this.target)
            toPlay.play()
            this.target.position.copy(newPosition)
            this.currentPosition = newPosition
        } 
    }

    #idle() {
        const newAction = IDLE_STATE     

        if (this.currentState !== newAction) {
            this.currentState = newAction
            const toPlay = this.animationsMap.get(newAction)
            const current = this.animationsMap.get(this.currentState)

            current.fadeOut(this.fadeDuration)
            toPlay.reset().fadeIn(this.fadeDuration).play()
        }        
    }
    
    update(time) {
        if (this.move){
            this.#move(time)
        } else {
            this.#idle()
        }
        

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
