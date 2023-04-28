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
        this.obstacles = []
        this.obstacleSpheres = []
        this.steeringBehaviors = []
    }

    addObstacles(obstacles) {
        this.obstacles = obstacles
        if (this.vehicle) {
            const obstacleAvoidanceBehavior = new YUKA.ObstacleAvoidanceBehavior(obstacles)
            this.steeringBehaviors.push(obstacleAvoidanceBehavior)

            this.vehicle.steering.add(obstacleAvoidanceBehavior)
        }
    }

    addObstacleSpheres(obstacleSpheres) {
        this.obstacleSpheres = obstacleSpheres
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
                    obj.castShagitdow = true
                }
            })
            if (this.vehicle) {
                model.matrixAutoUpdate = false
                this.vehicle.setRenderComponent(model, (entity, renderComponent) => {
                    renderComponent.matrix.copy(entity.worldMatrix)
                })
            }

            if (path.includes('horse') || path.includes('dog')) {
                const box = new THREE.Box3().setFromObject(model)
                const sphereRadius = box.getBoundingSphere(new THREE.Sphere()).radius
                this.sphere = this.#createBoundingSphere(model, sphereRadius)
            } else {
                this.sphere = this.#createBoundingSphere(model)
            }

            if (path.includes('house')) {
                this.#addTransparency(model)
            }

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
    }

    #addTransparency(model) {
        const materialToHide = []
        materialToHide.push(this.#getMaterial(model, 'Door_Group', 'CTRL_Hole'))

        for (const child of model.children) {
            if (child.name.includes('Window')) {
                for (const material of child.children) {
                    if (material.name.includes('CTRL_Hole')) {
                        materialToHide.push(this.#getMaterial(model, child.name, material.name))
                    }
                }
            }
        }

        for (const material of materialToHide) {
            this.#hide(material)
        }
    }

    #getMaterial(model, groupName, childName) {
        const group = model.children.find(obj => obj.name === groupName)
        const child = group.children.find(obj => obj.name === childName)
        return child.material
    }

    #hide(material) {
        material.transparent = true
        material.opacity = 0
    }

    #createBoundingSphere(model, radius) {
        if (!radius) {
            const boundingSphere = new THREE.Sphere()
            const box = new THREE.Box3().setFromObject(model)
            box.getBoundingSphere(boundingSphere)
            if (model.name === 'Pine') {
                boundingSphere.radius = boundingSphere.radius * 0.1
            }
        
            radius = boundingSphere.radius
        }
        const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32)

        const sphereMaterial = new THREE.MeshBasicMaterial( { visible: false, wireframe: true } )

        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
        sphere.name = model.name

        sphere.position.copy(model.position)

        this.scene.add(sphere)
        return sphere
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
        const { scale, rotation, boundingRadius } = position
        this.vehicle = new YUKA.Vehicle()
        this.vehicle.boundingRadius = boundingRadius
        this.vehicle.smoother = new YUKA.Smoother(30)

        this.vehicle.scale.set(scale, scale, scale)
        this.vehicle.rotation.y += rotation

        return this.vehicle
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
        this.vehicle.maxSpeed = 10

        const followPathBehavior = new YUKA.FollowPathBehavior(this.path, 3)
        this.vehicle.steering.add(followPathBehavior)

        const onPathBehavior = new YUKA.OnPathBehavior(this.path)
        this.vehicle.steering.add(onPathBehavior)
        this.steeringBehaviors.push(followPathBehavior, onPathBehavior)

        this.entityManager.add(this.vehicle)
        return this.path
    }

    getWayPoints() {
        const position = []
        for (let i = 0; i < this.path._waypoints.length; i++) {
            const waypoint = this.path._waypoints[i]
            position.push(waypoint.x, waypoint.y, waypoint.z)
        }

        return position
    }

    createObstacle(model) {
        const obstacle = new YUKA.GameEntity()
        obstacle.position.copy(model.position)
        this.entityManager.add(obstacle)
        this.sphere = this.#createBoundingSphere(model)
 
        return obstacle
    }
    
    updatePosition(newPosition) {
        this.currentPosition.copy(newPosition)
        this.sphere.position.copy(newPosition)
    }

    stopVehicle() {
        if (!this.stoped) {
            this.stoped = true
            this.stopedAt = this.vehicle.position
            this.vehicle.maxSpeed = 0.000000001
            
        }
        this.vehicle.position.copy(this.stopedAt)
        this.updatePosition(this.stopedAt)
    }

    startVehicle() {
        this.vehicle.maxSpeed = 10
        this.stoped = false  
    }
}