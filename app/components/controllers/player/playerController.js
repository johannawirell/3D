import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { InputController } from './inputController.js'
import { State } from './state.js'

const PATH_TO_PLAYER = '../../models/Soldier.glb'
const PLAYER_SCALE_VECTOR = new THREE.Vector3(5, 5, 5)

export class PlayerController {
    deceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0)
    acceleration = new THREE.Vector3(1, 0.25, 50.0)
    velocity = new THREE.Vector3(0, 0, 0)
    currentPosition = new THREE.Vector3()

    constructor(camera, scene) {
        this.animationsMap = new Map()
        this.inputController = new InputController()
        this.state = new State()
        this.currentState = this.state.current

        this.camera = camera
        this.scene = scene
    
        this.#loadPlayerModel()
    }

    get position() {
        return this.currentPosition
    }
    
    get rotation() {
        if (!this.target) {
            return new THREE.Quaternion()
        } else {
            return this.target.quaternion
        }
    }

    #loadPlayerModel() {
        new GLTFLoader().load(PATH_TO_PLAYER, gltf => {
            const model = gltf.scene
            model.scale.copy(PLAYER_SCALE_VECTOR)

            model.traverse(obj => {
                if (obj.isMesh) {
                    obj.castShadow = true
                }
            })
            this.target = gltf.scene
        
            this.scene.add(model)
        
            const gltfAnimations = gltf.animations

            this.mixer = new THREE.AnimationMixer(model)

            gltfAnimations.filter(a => a.name != 'TPose').forEach(a => {
                this.animationsMap.set(a.name, this.mixer.clipAction(a))
            })
          })
          
    }

    #animatePlayer() {
        // TODO: fixa
        let action
        const { states } = this.state

        const directionPressed = this.inputController.isDirectionsPressed()
        const shiftPressed = this.inputController.isShiftPressed()

        if (directionPressed && shiftPressed) {
            action = states.run
        } else if (directionPressed) {
            action = states.walk
        } else {
            action = states.idle
        }

        if (this.currentState != action) {
            const toPlay = this.animationsMap.get(action)
            const current = this.animationsMap.get(this.currentState)

            current.fadeOut(this.fadeDuration)
            toPlay.reset().fadeIn(this.fadeDuration).play()
        }
    }


    #updateVelocity(time, deceleration) {
        const velocity = this.velocity
        
        const frameDeceleration = new THREE.Vector3(
            velocity.x * deceleration.x,
            velocity.y * deceleration.y,
            velocity.z * deceleration.z
        )

        frameDeceleration.multiplyScalar(time)
        
        frameDeceleration.z = Math.sign(frameDeceleration.z) * Math.min(
            Math.abs(frameDeceleration.z),
            Math.abs(velocity.z)
        )
        
        velocity.add(frameDeceleration)
        return velocity
    }

    update(time) {
        const keys = this.inputController.keys
        this.#animatePlayer()          

        if (this.#isKeyAction(keys)) {
            this.currentState = this.state.update(keys)

            const deceleration = this.deceleration
            const velocity = this.#updateVelocity(time, deceleration)

            const controlObject = this.target
    
            const quaternion = new THREE.Quaternion()
            const axis = new THREE.Vector3()
            const rotation = controlObject.quaternion.clone()
          
            const acceleration = this.acceleration.clone()
    
            if (this.#isRunning()){
                acceleration.multiplyScalar(2.0)
            }
    
            if (keys.forward) {
                velocity.z -= acceleration.z * time
            }
            if (keys.backward) {
                velocity.z += acceleration.z * time
            }
            if (keys.left) {
                axis.set(0, 1, 0)
                quaternion.setFromAxisAngle(
                    axis, 
                    4.0 * Math.PI * time * acceleration.y
                )
                rotation.multiply(quaternion)
            }
            if (keys.right) {
                axis.set(0, 1, 0)
                quaternion.setFromAxisAngle(
                    axis,
                    4.0 * - Math.PI * time * acceleration.y
                )
                rotation.multiply(quaternion)
              }
          
            controlObject.quaternion.copy(rotation)
    
            const oldPosition = new THREE.Vector3()
            oldPosition.copy(controlObject.position)
          
            const forward = new THREE.Vector3(0, 0, 1)
            forward.applyQuaternion(controlObject.quaternion)
            forward.normalize()
          
            const sideways = new THREE.Vector3(1, 0, 0)
            sideways.applyQuaternion(controlObject.quaternion)
            sideways.normalize()
          
            sideways.multiplyScalar(velocity.x * time)
            forward.multiplyScalar(velocity.z * time)
          
            controlObject.position.add(forward)
            controlObject.position.add(sideways)
          
            this.currentPosition.copy(controlObject.position)
          
            if (this.mixer) {
                this.mixer.update(time)
            }
        }

      
    }

    #isKeyAction(keys) {
        return Object.values(keys).some(val => val)
    }

    #isRunning() {
        const { states } = this.state

        return this.state.current === states.run
    }
}
