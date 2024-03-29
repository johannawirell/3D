
import * as THREE from 'three'
const MIDDLE_WIDTH = window.innerWidth / 2 
const MIDDLE_HEIGHT = window.innerHeight / 2 
const ROTATION_SPEED = 0.005

export class ThirdPersonCamera {
    constructor(params) {
        this.params = params
        this.camera = params.camera
        this.target = params.target
    
        this.currentPosition = new THREE.Vector3()
        this.currentLookat = new THREE.Vector3()
        this.previousMousePosition = { 
          x: MIDDLE_WIDTH,
          y: MIDDLE_HEIGHT
        }
      }
       
    mouseMove(event) {
      const currentMousePosition = { x: event.clientX, y: event.clientY }
      const mouseDiff = {
          x: currentMousePosition.x - this.previousMousePosition.x,
          y: currentMousePosition.y - this.previousMousePosition.y
      }
        const euler = new THREE.Euler(0, 0, 0, 'XYZ')
        euler.setFromQuaternion(this.camera.quaternion.clone(), 'YXZ')
        euler.y -= mouseDiff.x * ROTATION_SPEED
        euler.x -= mouseDiff.y * ROTATION_SPEED
        euler.x = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, euler.x)
        )
        this.camera.quaternion.setFromEuler(euler)
    
        this.previousMousePosition = currentMousePosition      
    }


      #calculateIdeal(x, y, z) {
        const ideal = new THREE.Vector3(x, y, z)
        const targetRotation = this.target.getRotation().clone()
           
        ideal.applyQuaternion(targetRotation)
        ideal.add(this.target.getPosition())

        return ideal
      }

    update(timeElapsed) {   
      // Calculate the ideal offset and lookat position
      let idealOffset = this.#calculateIdeal(0, 10, 20)
      let idealLookat = this.#calculateIdeal(0, 1, 0)

  
      const t = 1.0 - Math.pow(0.001, timeElapsed)
      this.currentPosition.lerp(idealOffset, t)
      this.currentLookat.lerp(idealLookat, t)
    
      // Set the camera position and lookat
      this.camera.position.copy(this.currentPosition);
      this.camera.lookAt(this.currentLookat);
    }
      
}
