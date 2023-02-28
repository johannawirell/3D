import * as THREE from 'three'
import { A, D, DIRECTIONS, S, W } from './key'

const WALK = 'Walk'
const RUN = 'Run'
const IDLE = 'Idle'

const runVelocity = 50
const walkVelocity = 2

export class PlayerController {
    pressedKeys = {}
    shiftPressed = false
    direction = new THREE.Vector3()
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

        if (event.key === 'Shift') {
            this.shiftPressed = true
        }
    }

    #handleKeyUp(event) {
        this.pressedKeys[event.key.toLowerCase()] = false

        if (event.key === 'Shift') {
            this.shiftPressed = false
        }
    }


    #handleMovement(delta) {
        const angleYCameraDirection = this.#calculateCameraPosition()
        const directionOffsett = this.#calculateDirectionOfsett()

        // Rotate model
        this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffsett)
        this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.2)

        this.#setDirection(directionOffsett)

        this.#moveModel(delta) 
    }

    #calculateCameraPosition() {
        return Math.atan2(
            (this.camera.position.x - this.model.position.x), 
            (this.camera.position.z - this.model.position.z)
        )
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
            } else {
                directionOffset = Math.PI // Backwards only
            }
        // Leftwards
        } else if (this.pressedKeys[A]) {
            directionOffset = Math.PI / 2 
        }
        return directionOffset
    }
    

    #setDirection(directionOffset) {
        this.camera.getWorldDirection(this.direction)
        this.direction.y = 0
        this.direction.normalize()
        this.direction.applyAxisAngle(this.rotateAngle, directionOffset)
    }

    #moveModel(delta) {
        const velocity = this.shiftPressed ? runVelocity : walkVelocity

        const moveX = this.direction.x * velocity * delta
        const moveZ = this.direction.z * velocity * delta

        this.model.position.x += moveX
        this.model.position.z += moveZ
        
        this.#updateCameraTarget(moveX, moveZ)
    }

    #updateCameraTarget(moveX, moveZ) {
        this.camera.position.x += moveX
        this.camera.position.z += moveZ

        this.cameraTarget.x = this.model.position.x
        this.cameraTarget.y = this.model.position.y + 1
        this.cameraTarget.z = this.model.position.z
        this.orbitControl.target = this.cameraTarget
    }

    update(delta) {
        const directionPressed = DIRECTIONS.some(key => this.pressedKeys[key] === true) 
       
        let play = ''
        if (directionPressed && this.shiftPressed) {
            play = RUN
        } else if (directionPressed) {
            play = WALK
        } else {
            play = IDLE
        }

        if (this.currentAction != play) {
            const toPlay = this.animationsMap.get(play)
            const current = this.animationsMap.get(this.currentAction)

            current.fadeOut(this.fadeDuration)
            toPlay.reset().fadeIn(this.fadeDuration).play()

            this.currentAction = play
        }

        
        if (this.currentAction === RUN || this.currentAction === WALK) {
            this.#handleMovement(delta)
        }

        this.mixer.update(delta)
       
    }
}

