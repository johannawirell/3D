import * as THREE from 'three'
import { A, D, DIRECTIONS, S, W } from './key'

export class PlayerController {
    // state
    run = false
    walkDirection = new THREE.Vector3()
    rotateAngle = new THREE.Vector3(0, 1, 0)
    rotateQuarternion = new THREE.Quaternion()
    cameraTarget = new THREE.Vector3()
    pressedKeys = {}

    constructor(model, mixer, animationsMap, orbitControl, camera, currentAction) {
        this.model = model
        this.mixer = mixer
        this.animationsMap = animationsMap
        this.orbitControl = orbitControl
        this.camera = camera
        this.currentAction = currentAction
            
        this.#addEventListeners()
    }


    update(mixerUpdateDelta) {

        
    }


    #addEventListeners() {
        document.addEventListener('keydown', this.#handleKeyDown.bind(this))
        document.addEventListener('keyup', this.#handleKeyUp.bind(this))
    }

    #handleKeyDown(event) {
        this.pressedKeys[event.key.toLowerCase()] = true
        const directionsPressed = DIRECTIONS.some(key => this.pressedKeys[key] == true)
        
        if (directionsPressed) {
            console.log('handle direction')
        } else if (event.shiftKey){
            this.#switchRunToggle()
            console.log('handle run')
        } else {
            console.log('do nothing')
        }
    }
    
    #handleKeyUp(event) {
        this.pressedKeys[event.key.toLowerCase()] = false
    }

    #switchRunToggle() {
        this.run = !this.run
    }
}

