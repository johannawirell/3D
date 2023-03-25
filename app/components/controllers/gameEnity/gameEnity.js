import * as YUKA from 'yuka'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export class GameEnity {
    constructor(params) {
        this.entityManager = params.entityManager
        this.camera = params.camera
        this.scene = params.scene
        this.states = {}
        this.animationsMap = new Map()
        this.isDoneLoading = false
        this.time = new YUKA.Time()
    }

    setState(state) {
        this.currentState = state
    }

    getState() {
        return this.currentState
    }

    async loadGLTF(path) {
       await new Promise(resolve => {
        new GLTFLoader().load(path, gltf => {
            let model = gltf.scene
            model = this.position(model)
            model.traverse(obj => {
                if (obj.isMesh) {
                    obj.castShadow = true
                }
            })
            if (this.vehicle) {
                model.matrixAutoUpdate = false
                this.vehicle.setRenderComponent(model, (entity, renderComponent) => {
                    renderComponent.matrix.copy(entity.worldMatrix)
                })
            }
            
            this.target = model
            this.scene.add(model)
            this.gltfAnimation = gltf.animations
            this.mixer = new THREE.AnimationMixer(model)

            for (const action of this.gltfAnimation) {
                console.log(action)
                const name = action.name
                this.animationsMap.set(name, this.mixer.clipAction(action))
                this.states[name] = name
            }
            resolve()
          })
        })
        this.isDoneLoading = true
    }

    walk() {
        const newAction = this.states.Walk

        if (this.currentState !== newAction) {
            this.updateAnimation(newAction)
        }
    }

    idle() {
        const newAction = this.states.Idle

        if (this.currentState !== newAction) {
            this.updateAnimation(newAction)
        }
    }

    run() {
        const newAction = this.states.Run

        if (this.currentState !== newAction) {
            this.updateAnimation(newAction)
        }
    }

    updateAnimation(newAction) {
        const toPlay = this.animationsMap.get(newAction)
        const current = this.animationsMap.get(this.currentState)
        if (current) {
            current.fadeOut(this.fadeDuration)
            toPlay.reset().fadeIn(this.fadeDuration).play()
        } else {
            toPlay.play()
        }
        
        this.setState(newAction)
    }

    updateEnity() {
        const delta = this.time.update().getDelta()
        this.entityManager.update(delta)
    }

    createVehicle(position) {
        const { scale } = position
        this.vehicle = new YUKA.Vehicle()
        this.vehicle.boundingRadius = 1.9
        this.vehicle.smoother = new YUKA.Smoother(30)

        this.vehicle.scale.set(scale, scale, scale)
        this.vehicle.rotation.y += Math.PI / 2


    }

    createPath(path, isLoop) {
        this.path = new YUKA.Path()
        
        for(let i = 0; i < path.length; i++) {
            this.path.add(path[i])
        }
        if (isLoop) {
            this.path.loop = true
        }
               
        this.vehicle.position.copy(this.path.current())
        this.vehicle.rotation.y = Math.PI
        this.vehicle.maxSpeed = 15

        const followPathBehavior = new YUKA.FollowPathBehavior(this.path, 3) // TODO: vad står 3 för?
        this.vehicle.steering.add(followPathBehavior)

        this.entityManager.add(this.vehicle)
    }

    getWayPoints() {
        const position = []
        for(let i = 0; i < this.path._waypoints.length; i++) {
            const waypoint = this.path._waypoints[i]
            position.push(waypoint.x, waypoint.y, waypoint.z)
        }

        return position
    }

    createLine() {
        const position = this.getWayPoints()

        const lineGeometry = new THREE.BufferGeometry()
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3)) // TODO: vad står 3 för?

        const lineMaterial = new THREE.LineBasicMaterial({color: 0xFFFFFF})
        const lines = new THREE.LineLoop(lineGeometry, lineMaterial)
        this.scene.add(lines)
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