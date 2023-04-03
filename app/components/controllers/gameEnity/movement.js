import * as THREE from 'three'
import * as YUKA from 'yuka'

export class Movement {
    velocity = new THREE.Vector3(0, 0, 2)
    currentPosition = new THREE.Vector3()

    constructor(target, entityManager ) {
        this.target = target
        this.entityManager = entityManager
        
        this.#createVehicle()
    }

    #createVehicle() {
        this.vehicle = new YUKA.Vehicle()

        this.vehicle.boundingRadius = 1.9
        this.vehicle.smoother = new YUKA.Smoother(30)

        this.#addPathToVehicle()
    }

    #addPathToVehicle() {
        this.path = new YUKA.Path()
        this.path.add( new YUKA.Vector3(-4, 0, -11))
        this.path.add( new YUKA.Vector3(4, 0, -11))
        this.path.add( new YUKA.Vector3(4, 0, 11))
        this.path.add( new YUKA.Vector3(-4, 0, 11))

        this.path.loop = true

        this.vehicle.position.copy(this.path.current())

        const followPathBehavior = new YUKA.FollowPathBehavior(this.path, 3)
        this.vehicle.steering.add(followPathBehavior)
        
    }
}