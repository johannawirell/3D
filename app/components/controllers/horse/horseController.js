import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const PATH_TO_HORSE = '../../models/Horse.glb'
const WIDTH = 0.4
const HEIGHT = 0.4
const DEPTH = 0.4

const X_POSITION = -5
const Y_POSITION = 0
const Z_POSITION = -100

const WAYPOINTS = [
    new THREE.Vector3(-50, 0, -100),
    new THREE.Vector3(0, 0, -100),
    new THREE.Vector3(50, 0, -100),
    new THREE.Vector3(0, 0, -50),
    new THREE.Vector3(-50, 0, -50)
]

const SPEED = 1

export class HorseController {
    velocity = new THREE.Vector3(0, 0, 2)
    currentPosition = new THREE.Vector3()

    constructor(camera, scene) {
        this.camera = camera
        this.scene = scene

        this.waypointIndex = 0

        // this.angle = 10
        // this.radius = 50

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

 
    
    #move(time) {
        if (this.target) {
            const nextWaypoint = WAYPOINTS[this.waypointIndex]
            const currentPosition = this.target.position
            const newPosition = currentPosition.clone().lerp(nextWaypoint, SPEED * time)

            if (newPosition.distanceTo(nextWaypoint) < 0.1) {
                // hästen har nått en waypoint, gå till nästa waypoint
                this.waypointIndex = (this.waypointIndex + 1) % WAYPOINTS.length
            }

            this.target.position.copy(newPosition)
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

// #circle(time) {
//     const controlObject = this.target
//     const velocity = this.velocity
          
//     const forward = new THREE.Vector3(0, 0, 1)
//     forward.applyQuaternion(controlObject.quaternion)
//     forward.normalize()
  
//     const radius = 50
//     const angle = time / 1000 * Math.PI / 2  // Vi använder tid (time) för att beräkna vinkeln

//     const x = Math.sin(angle) * radius
//     const y = 0  
//     const z = Math.cos(angle) * radius 
//     const circle = new THREE.Vector3(x, y, z)
//     circle.applyQuaternion(controlObject.quaternion)
//     circle.normalize()
  
//     circle.multiplyScalar(velocity.x * time)
//     forward.multiplyScalar(velocity.z * time)
  
//     controlObject.position.add(forward)
//     controlObject.position.add(circle)
 
//     return controlObject
// }