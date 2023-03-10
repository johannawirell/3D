
import * as THREE from 'three'
const MIDDLE_WIDTH = window.innerWidth / 2 
const MIDDLE_HEIGHT = window.innerHeight / 2 
const ROTATION_SPEED = 0.005

  // Define the bounds of the camera volume
  const VOLUME_BOUNDS = {
    minX: -300,
    maxX: 3000,
    minZ: -320,
    maxZ: 320
  }


export class ThirdPersonCamera {
    constructor(params) {
        this.params = params
        this.camera = params.camera
    
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
        const targetRotation = this.params.target.rotation.clone()

        if (this.#isFacingCamera(targetRotation)) {
          targetRotation.y += Math.PI
        } else {
          // Rotate camera in the other direction
          const cameraRotation = targetRotation.clone()
          cameraRotation.y += Math.PI
          ideal.applyQuaternion(cameraRotation)
          
        }
           
        ideal.applyQuaternion(targetRotation)
        ideal.add(this.params.target.position)
        return ideal
      }

      #isFacingCamera(targetRotation) {
        return targetRotation.y < Math.PI/4 && targetRotation.y > -Math.PI/4
      }
   
    update(timeElapsed) {
      const playerPosition = this.params.target.position.clone();
  
      // Calculate the ideal offset and lookat position
      let idealOffset = this.#calculateIdeal(-1, 2, -2);
      let idealLookat = this.#calculateIdeal(0, 1, 0);
    
      // If the player is outside the volume bounds, adjust the camera position and lookat position
      if (playerPosition.x < VOLUME_BOUNDS.minX) {
        idealOffset.x += playerPosition.x - VOLUME_BOUNDS.minX
        idealLookat.x += playerPosition.x - VOLUME_BOUNDS.minX
      } else if (playerPosition.x > VOLUME_BOUNDS.maxX) {
        idealOffset.x += playerPosition.x - VOLUME_BOUNDS.maxX
        idealLookat.x += playerPosition.x - VOLUME_BOUNDS.maxX
      }
    
      if (playerPosition.z < VOLUME_BOUNDS.minZ) {
        idealOffset.z += playerPosition.z - VOLUME_BOUNDS.minZ
        idealLookat.z += playerPosition.z - VOLUME_BOUNDS.minZ
      } else if (playerPosition.z > VOLUME_BOUNDS.maxZ) {
        idealOffset.z += playerPosition.z - VOLUME_BOUNDS.maxZ
        idealLookat.z += playerPosition.z - VOLUME_BOUNDS.maxZ
      }
    
      // Interpolate the camera position and lookat towards the ideal positions
      const t = 1.0 - Math.pow(0.001, timeElapsed);
      this.currentPosition.lerp(idealOffset, t);
      this.currentLookat.lerp(idealLookat, t);
    
      // Set the camera position and lookat
      this.camera.position.copy(this.currentPosition);
      this.camera.lookAt(this.currentLookat);
  }
}
