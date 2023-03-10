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

    constructor(params) {
        this.animationsMap = new Map()
        this.inputController = new InputController()
        this.state = new State()
        this.currentState = this.state.current

        this.camera = params.camera
        this.scene = params.scene
        this.planePosition = params.planePosition
    
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
            let model = gltf.scene
            model = this.#updateInitialPosition(model)
            model.traverse(obj => {
                if (obj.isMesh) {
                    obj.castShadow = true
                }
            })
            this.scene.add(model)

            this.target = gltf.scene           
        
            const gltfAnimations = gltf.animations
            this.mixer = new THREE.AnimationMixer(model)
            gltfAnimations.filter(a => a.name != 'TPose').forEach(a => {
                this.animationsMap.set(a.name, this.mixer.clipAction(a))
            })
          })

          this.#updateInitialPosition()
    }

    #updateInitialPosition(model) {
        if (model) {
            model.scale.copy(PLAYER_SCALE_VECTOR)       
        }
        return model
    }     

    #animatePlayer() {
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

        if (this.currentState !== action) {
            const toPlay = this.animationsMap.get(action)
            const current = this.animationsMap.get(this.currentState)

            current.fadeOut(this.fadeDuration)
            toPlay.reset().fadeIn(this.fadeDuration).play()
        }
    }

    #updateVelocity(time) {
        const deceleration = this.deceleration
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

    #turn(left, right, rotation, time, acceleration) {
        const quaternion = new THREE.Quaternion()
        const axis = new THREE.Vector3()

        if (left) {
            axis.set(0, 1, 0)
            quaternion.setFromAxisAngle(
                axis, 
                4.0 * Math.PI * time * acceleration.y
            )
            rotation.multiply(quaternion)
        }

        if (right) {
            axis.set(0, 1, 0)
            quaternion.setFromAxisAngle(
                axis,
                4.0 * - Math.PI * time * acceleration.y
            )
            rotation.multiply(quaternion)
          }

        return rotation
    }

    #move(forwards, velocity, time, acceleration) {
        if (forwards) {
            if (this.#isRunning()) {
                acceleration.multiplyScalar(2.0)
            }
            velocity.z -= acceleration.z * time
        } else {
            velocity.z += acceleration.z * time
        }
    }

    #updatePosition(rotation, velocity, time, controlObject) {
        if (this.#isOverEdge()) {
            this.#handleOverEdge(controlObject, rotation)
        } else {
            controlObject.quaternion.copy(rotation)
            
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
        }
    }

    #handleMovement(time, keys) {
        this.currentState = this.state.update(keys, this.inputController.isDirectionsPressed())

        const velocity = this.#updateVelocity(time)

        const controlObject = this.target
        let rotation = controlObject.quaternion.clone()
        const acceleration = this.acceleration.clone()

        if (keys.left || keys.right) {
            rotation = this.#turn(keys.left, keys.right, rotation, time, acceleration)
        }

        if (this.#isRunning()){
            acceleration.multiplyScalar(2.0)
        }

        if (keys.forward) {
            this.#move(true, velocity, time, acceleration)
        } else if (keys.backward) {
            this.#move(false, velocity, time, acceleration)
        }

        this.#updatePosition(rotation, velocity, time, controlObject)
    }

    update(time) {
        const keys = this.inputController.keys
        if (this.move) {
            this.#animatePlayer()          

            if (this.#isKeyAction(keys)) {
                this.#handleMovement(time, keys)
            } else {
                this.currentState = this.state.update()
            }
    
        }
        
        if (this.mixer) {
            this.mixer.update(time)
        }
    }

    #isKeyAction(keys) {
        return Object.values(keys).some(val => val)
    }

    #isRunning() {
        const { states } = this.state

        return this.state.current === states.run
    }

    #isOverEdge() {
        if (this.currentPosition.z < (this.planePosition.z) * -1) {
            return true
        } else if (this.currentPosition.z > this.planePosition.z) {
            return true
        } else if (this.currentPosition.x < (this.planePosition.x) * -1) {
            return true
        } else if (this.currentPosition.x > this.planePosition.z) {
            return true
        }
    }

    #handleOverEdge(controlObject, rotation) {
        controlObject.quaternion.copy(rotation)
            
        const backwards = new THREE.Vector3(-10, 0, -10)
        backwards.applyQuaternion(controlObject.quaternion)
        backwards
            .negate()
            .normalize()
            .multiplyScalar(0.5)
        
    
        console.log(controlObject.position)
        controlObject.position.add(backwards)

        this.currentPosition.copy(controlObject.position)


        // // Move the player slightly backwards to avoid getting stuck in the object
        // const backwards = new THREE.Vector3(0, 0, 1)
        // backwards.applyQuaternion(this.target.quaternion)
        // backwards.negate().normalize().multiplyScalar(0.5)
        // this.currentPosition.add(backwards)
      
        // // Reset the velocity to 0 so the player stops moving
        // this.velocity.set(0, 0, 0)
        // this.currentPosition.copy(controlObject.position)
    }
}
