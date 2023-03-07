import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { InputController } from './inputController.js'
import { State } from './state.js'

const PATH_TO_PLAYER = '../../models/Soldier.glb'

export class PlayerController {
    decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0)
    acceleration = new THREE.Vector3(1, 0.25, 50.0)
    velocity = new THREE.Vector3(0, 0, 0)
    position = new THREE.Vector3()

    constructor(camera, scene) {
        this.animationsMap = new Map()
        this.camera = camera
        this.scene = scene
        this.input = new InputController()
        this.state = new State()
       
        this.#loadModel()
    }

    get Position() {
        return this.position
    }
    
    get rotation() {
        if (!this.target) {
            return new THREE.Quaternion()
        } else {
            return this.target.quaternion
        }
    }

    #loadModel() {
        new GLTFLoader().load(PATH_TO_PLAYER, gltf => {
            const model = gltf.scene

            model.scale.set(5, 5, 5)
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

    #calculateDirectionOffset() {
        let directionOffset = 0
        const keys = this.input.keys

        if (keys.forward) {
            if (keys.left) {
                directionOffset = Math.PI / 4
            } else if (keys.right) {
                directionOffset = - Math.PI / 4
            }
        } else if (keys.backward) {
            if (keys.left) {
                directionOffset =  Math.PI / 4 + Math.PI / 2 
            } else if (keys.right) {
                directionOffset =  -Math.PI / 4 - Math.PI / 2
            } else {
                directionOffset = Math.PI
            }
        } else if (keys.left) {
            directionOffset = Math.PI / 2 
        } else if (keys.right) {
            directionOffset = - Math.PI / 2
        }
        return directionOffset
    }


    update(time) {
        const keys = this.input.keys
        // If no key action
        if (!Object.values(keys).some(val => val)) {
            this.state.update()
            return
        }
        this.state.update(keys)

        // Animation
        const currentState = this.state.current
        const toPlay = this.animationsMap.get(currentState)
        const current = this.animationsMap.get(currentState)
        current.fadeOut(this.fadeDuration)
        toPlay.reset().fadeIn(this.fadeDuration).play()

      
        const velocity = this.velocity
        
        const frameDecceleration = new THREE.Vector3(
            velocity.x * this.decceleration.x,
            velocity.y * this.decceleration.y,
            velocity.z * this.decceleration.z
        )

        frameDecceleration.multiplyScalar(time)
        
        frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
            Math.abs(frameDecceleration.z),
            Math.abs(velocity.z)
        )
        
        velocity.add(frameDecceleration)
      
        const controlObject = this.target
        const _Q = new THREE.Quaternion()
        const _A = new THREE.Vector3()
        const _R = controlObject.quaternion.clone()
      
        const acc = this.acceleration.clone()

        if (this.state.current === this.state.states.run){
            acc.multiplyScalar(2.0) // TODO: ta bort hårdkod
        }

        // TODO swift
        if (keys.forward) {
            velocity.z -= acc.z * time
        }
        if (keys.backward) {
            velocity.z += acc.z * time
            
        }
        if (keys.left) {
            _A.set(0, 1, 0)
            _Q.setFromAxisAngle(
                _A, 
                4.0 * Math.PI * time * this.acceleration.y
            )
            _R.multiply(_Q)
        }
        if (keys.right) {
            _A.set(0, 1, 0)
            _Q.setFromAxisAngle(
                _A,
                4.0 * - Math.PI * time * this.acceleration.y
            )
            _R.multiply(_Q)
          }
      
        controlObject.quaternion.copy(_R)

      
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
      
        this.position.copy(controlObject.position)
      
        if (this.mixer) {
            this.mixer.update(time)
        }
    }  
}
