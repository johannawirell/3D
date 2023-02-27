import * as THREE from 'three'
import { A, D, DIRECTIONS, S, W } from './key'

const WALK = 'Walk'
const RUN = 'Run'
const IDLE = 'Idle'

export class PlayerController {
    // state
    pressedKeys = {}
    run = false
    walkDirection = new THREE.Vector3()
    rotateAngle = new THREE.Vector3(0, 1, 0)
    rotateQuarternion = new THREE.Quaternion()
    cameraTarget = new THREE.Vector3()

    constructor(model, mixer, animationsMap, orbitControl, camera, currentAction) {
        this.model = model
        this.mixer = mixer
        this.animationsMap = animationsMap
        this.orbitControl = orbitControl
        this.camera = camera
        this.currentAction = currentAction
        
        this.#addEventListeners()
    }

    #addEventListeners() {
        document.addEventListener('keydown', this.#handleKeyDown.bind(this))
        document.addEventListener('keyup', this.#handleKeyUp.bind(this))
    }

    #handleKeyDown(event) {
        this.pressedKeys[event.key.toLowerCase()] = true
    }

    #handleKeyUp(event) {
        this.pressedKeys[event.key.toLowerCase()] = false
    }

    #handleMovement() {
       const directionOfsett = this.#calculateDirectionOfsett()
    }

    #calculateDirectionOfsett() {
        const pressedKeys = this.pressedKeys
        let directionOffset = 0 // Forwards

        // Forwards
        if (pressedKeys[W]) {
            if (pressedKeys[A]) {
                directionOffset = Math.PI / 4 // Forward + left
            } else if (pressedKeys[D]) { 
                directionOffset = - Math.PI / 4// Forward + right
            } 
        // Rightwards
        } else if (pressedKeys[D]) {
            directionOffset = - Math.PI / 2 
        // Backwards
        } else if (pressedKeys[S]) {
            if (pressedKeys[A]) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // Backwards + left
            } else if (pressedKeys[D]) {
                directionOffset =  -Math.PI / 4 - Math.PI / 2 // Backwards + right
            }
        // Leftwards
        } else if (this.pressedKeys[A]) {
            directionOffset = Math.PI / 2 
        }
        return directionOffset
    }


    update(delta) {
        const isDirectionPressed = DIRECTIONS.some(key => this.pressedKeys[key] === true) 
        if (isDirectionPressed) {
            this.#handleMovement()
        }

        this.mixer.update(delta)
        if (this.currentAction === WALK) {
            console.log('WALK')
        } else if (this.currentAction === RUN) {
            console.log('RUN')
        } else if (this.currentAction === IDLE) {
            // console.log('STAND STILL')
        }
    }
}

