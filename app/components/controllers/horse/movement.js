import * as THREE from 'three'

export class Movement {
    velocity = new THREE.Vector3(0, 0, 2)
    currentPosition = new THREE.Vector3()
    startPosition = {x: -5, z: -100}

    constructor(waypoints) {
        this.waypoints = waypoints
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

    updateWayPoints(waypoints) {
        this.waypoints = waypoints
    }

    calculateAvoidanceWaypoints(obstaclePosition, currentPosition, waypoints) {
        const MAX_AVOIDANCE_ANGLE = Math.PI / 4 // Maximum angle to turn away from obstacle
        const AVOIDANCE_DISTANCE = 40 // Distance to keep from obstacle
    
        const avoidanceVector = new THREE.Vector3()
        avoidanceVector.subVectors(currentPosition, obstaclePosition)
        avoidanceVector.normalize()
    
        const newWaypoints = []
    
        for (let i = 0; i < waypoints.length; i++) {
          const waypoint = waypoints[i]
          const toWaypoint = new THREE.Vector3()
          toWaypoint.subVectors(waypoint, currentPosition)
    
          const angle = avoidanceVector.angleTo(toWaypoint)
    
          if (angle < MAX_AVOIDANCE_ANGLE && toWaypoint.length() < AVOIDANCE_DISTANCE) {
            const avoidanceDirection = new THREE.Vector3()
            avoidanceDirection.crossVectors(avoidanceVector, toWaypoint)
            avoidanceDirection.normalize()
    
            const avoidanceOffset = avoidanceDirection.clone()
            avoidanceOffset.multiplyScalar(AVOIDANCE_DISTANCE)
            const newWaypoint = waypoint.clone()
            newWaypoint.add(avoidanceOffset)
    
            newWaypoints.push(newWaypoint)
          } else {
            newWaypoints.push(waypoint.clone())
          }
        }
    
        return newWaypoints
      }
}