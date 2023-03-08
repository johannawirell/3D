import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const PATH_TO_HORSE = '../../models/Horse.glb'
const WIDTH = 0.4
const HEIGHT = 0.4
const DEPTH = 0.4

const X_POSITION = -5
const Y_POSITION = 0
const Z_POSITION = -100


export class HorseController {
    velocity = new THREE.Vector3(0, 0, 5)
    currentPosition = new THREE.Vector3()

    constructor(camera, scene) {
        this.camera = camera
        this.scene = scene

        // this.angle = 10
        // this.radius = 1

        this.#loadHorseModel()
    }

    get position() {
        return this.currentPosition
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

            const gltfAnimation = gltf.animations[0]
            this.mixer = new THREE.AnimationMixer(model)
            const action = this.mixer.clipAction(gltfAnimation)
            action.play()

            this.target = gltf.scene
          })
    }

    #forward(time, controlObject) {
        const velocity = this.velocity
        const forward = new THREE.Vector3(0, 0, -5)
        forward.applyQuaternion(controlObject.quaternion)
        forward.normalize()
        forward.multiplyScalar(velocity.z * time)
        controlObject.position.add(forward)
    }

    #move(time) {
        if (this.target) {
            const velocity = this.velocity
            const controlObject = this.target
            let rotation = controlObject.quaternion.clone()


            controlObject.quaternion.copy(rotation)
            
            // 
            this.#forward(time, controlObject)
            

        
            // const sideways = new THREE.Vector3(10, 0, 0)
            // sideways.applyQuaternion(controlObject.quaternion)
            // sideways.normalize()
        
            // sideways.multiplyScalar(velocity.x * time)
            
        
            
            // controlObject.position.add(sideways)

            this.currentPosition.copy(controlObject.position) 

        }
    }

    update(time) {
        if (this.mixer) {
            this.mixer.update(time)
        }

        this.#move(time)
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
