import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const PATH_TO_HORSE = '../../models/Horse.glb'
const WIDTH = 0.4
const HEIGHT = 0.4
const DEPTH = 0.4

const X_POSITION = -5
const Y_POSITION = 0
const Z_POSITION = -100

const FORWARDS = new THREE.Vector3(-5, 0, -50)
const RIGHTWARDS =  new THREE.Vector3(50, 0, -50)
const BACKWARDS = new THREE.Vector3(50, 0, -100)
const LEFTWARDS = new THREE.Vector3(-5, 0, -100)

const WAYPOINTS = [FORWARDS, RIGHTWARDS, BACKWARDS, LEFTWARDS]

const SPEED = 1

export class HorseController {
    velocity = new THREE.Vector3(0, 0, 2)
    currentPosition = new THREE.Vector3()

    constructor(camera, scene) {
        this.camera = camera
        this.scene = scene

        this.waypointIndex = 0

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

    #rotate(newPosition) {
        const forward = newPosition.clone().sub(this.target.position).normalize()
        const up =  new THREE.Vector3(0, 1, 0)
        const right = new THREE.Vector3().crossVectors(forward, up).normalize()

        const lookRotation = new THREE.Matrix4()
        lookRotation.set(
          right.x, up.x, -forward.x, 0,
          right.y, up.y, -forward.y, 0,
          right.z, up.z, -forward.z, 0,
          0, 0, 0, 1
        )
      
        this.target.rotation.setFromRotationMatrix(lookRotation)
      } 
    
    #move(time) {
        if (this.target) {
            const nextWaypoint = WAYPOINTS[this.waypointIndex]
            const currentPosition = this.target.position
            const newPosition = currentPosition.clone().lerp(nextWaypoint, SPEED * time)

            this.#rotate(nextWaypoint)

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
