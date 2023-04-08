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
    }

    addObstacles(obstacles) {
        this.obstacles = obstacles
        const obstacleAvoidanceBehavior = new YUKA.ObstacleAvoidanceBehavior(obstacles)
        this.vehicle.steering.add(obstacleAvoidanceBehavior)
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
        this.vehicle.boundingRadius = 50
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

        const followPathBehavior = new YUKA.FollowPathBehavior(this.path, 3)
        this.vehicle.steering.add(followPathBehavior)

        this.entityManager.add(this.vehicle)
    }

    getWayPoints() {
        const position = []
        for (let i = 0; i < this.path._waypoints.length; i++) {
            const waypoint = this.path._waypoints[i]
            position.push(waypoint.x, waypoint.y, waypoint.z)
        }

        return position
    }

    #paintSphere(model, boundingRadius) {
        const sphereGeometry = new THREE.SphereGeometry(boundingRadius, 32, 32);

        // Skapa ett material för sfären.
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

        // Skapa en mesh av sfärgeometrin och materialet.
        const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

        // Positionera meshen vid hinderentitetens position.
        sphereMesh.position.copy(model.position);

        // Lägg till meshen till scenen.
        this.scene.add(sphereMesh)

    }

    // createSphere(model) {
    //     if (model) {
    //         const boundingBox = new THREE.Box3().setFromObject(model)
    //         const size = new THREE.Vector3();
    //         boundingBox.getSize(size)

    //         const radius = size.length() / 10

    //         // Skapa sphären och lägg till den i scenen.
    //         const sphereGeometry = new THREE.SphereGeometry(radius, 1, 1);
    //         const sphereMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.5});
    //         const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    //         sphere.position.copy(model.position);
    //         this.scene.add(sphere);

    //         return sphere
    //     }
    // }

    createObstacle(model, boundingRadius) {
        const obstacle = new YUKA.GameEntity()
        obstacle.position.copy(model.position)
        this.entityManager.add(obstacle)
        obstacle.boundingRadius = boundingRadius

        this.#paintSphere(obstacle, boundingRadius)        
        return obstacle
    }
    
}