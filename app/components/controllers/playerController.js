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

    constructor(scene, camera, orbitControl, currentAction) {
        // this.mixer
        // this.model
        
        // this.camera = camera
        // this.animationsMap = new Map()
        // this.orbitControl = orbitControl
        

        // this.currentAction = currentAction
            

        // this.#addEventListeners()
    }


    update(mixerUpdateDelta) {
        const directionPressed = DIRECTIONS.some(key => this.pressedKeys[key] == true)
        let play = ''
        if (directionPressed && this.toggleRun) {
            play = 'Run'
        } else if (directionPressed) {
            play = 'Walk'
        } else {
            play = 'Idle'
        }

        if (this.currentAction != play) {
            const toPlay = this.animationsMap.get(play)
            const current = this.animationsMap.get(this.currentAction)

            current.fadeOut(this.fadeDuration)
            toPlay.reset().fadeIn(this.fadeDuration).play();

            this.currentAction = play
        }

        this.mixer.update(delta)

        if (this.currentAction == 'Run' || this.currentAction == 'Walk') {
            // calculate towards camera direction
            var angleYCameraDirection = Math.atan2(
                    (this.camera.position.x - this.model.position.x), 
                    (this.camera.position.z - this.model.position.z))
            // diagonal movement angle offset
            var directionOffset = this.directionOffset(keysPressed)

            // rotate model
            this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffset)
            this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.2)

            // calculate direction
            this.camera.getWorldDirection(this.walkDirection)
            this.walkDirection.y = 0
            this.walkDirection.normalize()
            this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset)

            // run/walk velocity
            const velocity = this.currentAction == 'Run' ? this.runVelocity : this.walkVelocity

            // move model & camera
            const moveX = this.walkDirection.x * velocity * delta
            const moveZ = this.walkDirection.z * velocity * delta
            this.model.position.x += moveX
            this.model.position.z += moveZ
            this.updateCameraTarget(moveX, moveZ)
        }
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
        console.log('run: ' + this.run)
    }
}

