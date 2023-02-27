import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'
import { A, D, DIRECTIONS, S, W } from './key'

const PATH_TO_MODEL = '../../models/Soldier.glb'
const WIDTH = 5
const HEIGHT = 5
const DEPTH = 5

export class PlayerController {
    model
    mixer
    // state
    run = false
    walkDirection = new THREE.Vector3()
    rotateAngle = new THREE.Vector3(0, 1, 0)
    rotateQuarternion = new THREE.Quaternion()
    cameraTarget = new THREE.Vector3()
    pressedKeys = {}

    constructor(camera, orbitControl, currentAction) {
        this.camera = camera
        this.animationsMap = new Map()
        this.orbitControl = orbitControl

        this.currentAction = currentAction
            

        this.#addEventListeners()
    }

    addPlayerTo(scene) {
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

                this.model = model
                this.mixer = new THREE.AnimationMixer(model)
                const gltfAnimations = gltf.animations
                gltfAnimations.filter(a => a.name != 'TPose').forEach(a => {
                    this.animationsMap.set(a.name, this.mixer.clipAction(a))
                })
            })
        return scene
    } 

    update(mixerUpdateDelta) {

    }

    #addEventListeners() {
        document.addEventListener('keydown', this.#handleKeyDown.bind(this))
        document.addEventListener('keyup', this.#handleKeyUp.bind(this))
    }

    #handleKeyDown(event) {
        this.pressedKeys[event.key.toLowerCase()] = true
        if (event.shiftKey) {
            this.#switchRunToggle()
        }
    }
    
    #handleKeyUp(event) {
        this.pressedKeys[event.key.toLowerCase()] = false
    }

    #switchRunToggle() {
        this.run = !this.run
    }
}

