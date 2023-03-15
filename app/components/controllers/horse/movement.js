import * as THREE from 'three'

export class Movement {
    velocity = new THREE.Vector3(0, 0, 2)
    currentPosition = new THREE.Vector3()

    constructor(waypoints) {
        this.waypoints = waypoints
        this.speed = 0.5
        this.waypointIndex = 0
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