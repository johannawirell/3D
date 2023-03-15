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

    #rotate(newPosition, target) {
        // const forward = newPosition.clone().sub(target.position).normalize()
        // const up =  new THREE.Vector3(0, 1, 0)
        // const right = new THREE.Vector3().crossVectors(forward, up).normalize()

        // const lookRotation = new THREE.Matrix4()
        // lookRotation.set(
        //   right.x, up.x, -forward.x, 0,
        //   right.y, up.y, -forward.y, 0,
        //   right.z, up.z, -forward.z, 0,
        //   0, 0, 0, 1
        // )
      
        // target.rotation.setFromRotationMatrix(lookRotation)
      } 

    move(time, target) {
        // const nextWaypoint = this.waypoints[this.waypointIndex]
        // const currentPosition = target.position
        // const newPosition = currentPosition.clone().lerp(nextWaypoint, this.speed * time)

        // this.#rotate(nextWaypoint.clone(), target)

        // if (newPosition.distanceTo(nextWaypoint) < 10) {
        //     this.waypointIndex = (this.waypointIndex + 1) % this.waypoints.length
        // }

        // return newPosition
    }
}