import * as YUKA from 'yuka'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Movement } from './movement'

export class GameEnity {
    constructor(params) {
        this.entityManager = params.entityManager
        this.camera = params.camera
        this.scene = params.scene
        this.states = {}
        this.animationsMap = new Map()
        this.isDoneLoading = false
    }

    setState(state) {
        this.currentState = state
    }

    getState() {
        return this.currentState
    }

    async loadGLTF(path, movement) {
       await new Promise(resolve => {
        new GLTFLoader().load(path, gltf => {
            let model = gltf.scene
            model = this.position(model)
            model.traverse(obj => {
                if (obj.isMesh) {
                    obj.castShadow = true
                }
            })
            
            this.target = model
            
            
            this.scene.add(model)

            this.gltfAnimation = gltf.animations

            this.mixer = new THREE.AnimationMixer(model)

            for (const action of this.gltfAnimation) {
                const name = action.name
                this.animationsMap.set(name, this.mixer.clipAction(action))
                this.states[name] = name
            }
            resolve()
          })
        })
        this.isDoneLoading = true

        if (movement) {
            this.createMovement()
        }
    }

    createMovement() {
        if (this.target) {
            this.movement = new Movement(this.target, this.entityManager)
        }
    }

    walk() {
        const newAction = this.states.Walk

        if (this.currentState !== newAction) {
            const toPlay = this.animationsMap.get(newAction)
            toPlay.play()
            this.setState(newAction)
        }
    }

    idle() {
        const newAction = this.states.Idle

        if (this.currentState !== newAction) {
            this.updateAnimation(newAction)
        }
    }

    updateAnimation(newAction) {
        const toPlay = this.animationsMap.get(newAction)
        const current = this.animationsMap.get(this.currentState)
        current.fadeOut(this.fadeDuration)
        toPlay.reset().fadeIn(this.fadeDuration).play()
        this.setState(newAction)
    }

    createObstacle() {
        if (this.target) {
            this.obstacle = new YUKA.GameEntity()
            this.obstacle.position.copy(this.target.position)
            this.obstacle.boundingBox = this.sphere.radius
            this.entityManager.add(this.obstacle)
            return this.obstacle
        }
    }

    getBoundingSphereForGLTF(gltfObject) {
        const box = new THREE.Box3().setFromObject(gltfObject)
        this.sphere = new THREE.Sphere()
        box.getBoundingSphere(this.sphere)

        return box
    }
}