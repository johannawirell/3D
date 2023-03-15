import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { CollisonHandler } from '../collisonHandler/collisonHandler'
import { Movement } from './movement'

const PATH_TO_HORSE = '../../models/Daffy.glb'
const COLLIDING_OBJECT_NAMES = ['Tree']
const SCALE = 0.4

const X_POSITION = 50
const Y_POSITION = 0
const Z_POSITION = -100

const WALK_STATE = 'Walk'
const IDLE_STATE = 'Idle'

export class HorseController extends CollisonHandler {
    velocity = new THREE.Vector3(0, 0, 2)
    currentPosition = new THREE.Vector3(X_POSITION, Y_POSITION, Z_POSITION)

    constructor(params) {
        super(params)
        this.entityManager = params.entityManager
        this.camera = params.camera
        this.scene = params.scene
        this.animationsMap = new Map()
        this.move = true
        this.currentState = WALK_STATE

        this.#loadHorseModel()
    }

    get position() {
        return this.currentPosition
    }

    stopMovement() {
        this.move = false
    }

    startMovement() {
        this.move = true
    }

    #loadHorseModel() {
        new GLTFLoader().load(PATH_TO_HORSE, gltf => {
            let model = gltf.scene
            model = this.#updateInitialPosition(model)
            model = this.createBoundingBox(model)
            model.traverse(obj => {
                if (obj.isMesh) {
                    obj.castShadow = true
                }
            })
            model.name = 'Daffy'
            
            this.target = model
            this.#createMovement()
            this.scene.add(model)

            this.gltfAnimation = gltf.animations

            this.mixer = new THREE.AnimationMixer(model)
            for (const action of this.gltfAnimation) {
                this.animationsMap.set(action.name, this.mixer.clipAction(action))
            }
          })
    }

    #createMovement() {
        this.movement = new Movement(this.target, this.entityManager)
    }

    #move(time) {
        if (this.target) {
            const toPlay = this.animationsMap.get(this.currentState)
            toPlay.play()
            // this.collidingObject = this.getCollidingObject(COLLIDING_OBJECT_NAMES)
            // if (this.collidingObject) {
            //     this.#handleCollison()
            // }
            // const newPosition = this.movement.move(time, this.target)    
            // this.target.position.copy(newPosition)
            // this.currentPosition = newPosition     
        } 
    }

    #handleCollison() {
        console.log('handle collison')
    }

    #idle() {
        const newAction = IDLE_STATE     

        if (this.currentState !== newAction) {
            this.currentState = newAction
            const toPlay = this.animationsMap.get(newAction)
            const current = this.animationsMap.get(this.currentState)

            current.fadeOut(this.fadeDuration)
            toPlay.reset().fadeIn(this.fadeDuration).play()
        }        
    }
    
    update(time) {
        if (this.move){
            this.#move(time)
        } else {
            this.#idle()
        }
        
        this.updateBoundingBox(this.target)

        if (this.mixer) {
            this.mixer.update(time)
        }
    }

   #updateInitialPosition(model) {
        if (model) {
            model.scale.set(SCALE, SCALE, SCALE)
            model.position.set(X_POSITION, Y_POSITION, Z_POSITION)
            model.rotateY(Math.PI)
        }
        return model
    }
}
