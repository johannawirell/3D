import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { A, D, DIRECTIONS, S, W } from '../key'
import { ThirdPersonCamera } from './thirdPersonCamera'

const WALK = 'Walk'
const RUN = 'Run'
const IDLE = 'Idle'
const PATH_TO_PLAYER = '../../models/Soldier.glb'

const runVelocity = 10
const walkVelocity = 2

export class PlayerController {
    pressedKeys = {}
    shiftPressed = false
    direction = new THREE.Vector3()
    target = new THREE.Vector3()
    rotateAngle = new THREE.Vector3(0, 1, 0)
    rotateQuarternion = new THREE.Quaternion()

    constructor(camera, scene) {
        this.camera = camera
        this.scene = scene
        this.model = this.#createModel()
        this.currentAction = IDLE
        
        this.#addEventListeners()
    }

    #createModel() {
        return new GLTFLoader().load(PATH_TO_PLAYER, gltf => {
            const model = gltf.scene
            model.scale.set(5, 5, 5)
            model.traverse(obj => {
                if (obj.isMesh) obj.castShadow = true
            })
            this.scene.add(model)
        
            const gltfAnimations = gltf.animations
            this.mixer = new THREE.AnimationMixer(model)
            this.animationsMap = new Map()
            gltfAnimations.filter(a => a.name != 'TPose').forEach(a => {
                this.animationsMap.set(a.name, this.mixer.clipAction(a))
            })
            return model
          })
          
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

    #handleMovement(time) {
        const directionOffsett = this.#calculateDirectionOfsett()
        this.#setDirection(directionOffsett)
        const angleYCameraDirection = this.camera.calculateCameraPosition()

        // Rotate model
        this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffsett)
        this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.2)

        this.camera.move()
        this.#moveModel(time)        
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
        // this.camera.getWorldDirection(this.direction)
        this.direction.y = 0
        this.direction.normalize()
        this.direction.applyAxisAngle(this.rotateAngle, directionOffset)
    }

    #moveModel(time) {
        const velocity = this.shiftPressed ? runVelocity : walkVelocity

        const moveX = this.direction.x * velocity * time
        const moveZ = this.direction.z * velocity * time

        this.model.position.x += moveX
        this.model.position.z += moveZ
    }

    update(time) {
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
            this.#handleMovement(time)
        }

        // this.mixer.update(time)
    }
}
