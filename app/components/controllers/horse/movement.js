import * as THREE from 'three'
const FORWARDS = new THREE.Vector3(-5, 0, -50)
const RIGHTWARDS =  new THREE.Vector3(50, 0, -50)
const BACKWARDS = new THREE.Vector3(50, 0, -100)
const LEFTWARDS = new THREE.Vector3(-5, 0, -100)

export class Movement {
    velocity = new THREE.Vector3(0, 0, 2)
    currentPosition = new THREE.Vector3()
    startPosition = {x: -5, z: -100}

    constructor() {
        this.waypoints = [
            FORWARDS,
            new THREE.Vector3(25, 0, 0),
            RIGHTWARDS,
            BACKWARDS,
            new THREE.Vector3(25, 0, -125),
            LEFTWARDS
        ]
        this.speed = 0.5
        this.waypointIndex = 0
    }

    #rotate(newPosition, target) {
        const forward = newPosition.clone().sub(target.position).normalize()
        const up =  new THREE.Vector3(0, 1, 0)
        const right = new THREE.Vector3().crossVectors(forward, up).normalize()

        const lookRotation = new THREE.Matrix4()
        lookRotation.set(
          right.x, up.x, -forward.x, 0,
          right.y, up.y, -forward.y, 0,
          right.z, up.z, -forward.z, 0,
          0, 0, 0, 1
        )
      
        target.rotation.setFromRotationMatrix(lookRotation)
      } 

    move(time, target) {
        const nextWaypoint = this.waypoints[this.waypointIndex]
        const currentPosition = target.position
        const newPosition = currentPosition.clone().lerp(nextWaypoint, this.speed * time)

        this.#rotate(nextWaypoint, target)

        if (newPosition.distanceTo(nextWaypoint) < 10) {
            this.waypointIndex = (this.waypointIndex + 1) % this.waypoints.length
        }

        return newPosition

    }
}