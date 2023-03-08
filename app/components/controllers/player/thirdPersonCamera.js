
import * as THREE from 'three'
export class ThirdPersonCamera {

    constructor(params) {
        this.params = params
        this.camera = params.camera
    
        this.currentPosition = new THREE.Vector3()
        this.currentLookat = new THREE.Vector3()
        this.prevMousePos = { x: 0, y: 0 }
      }
       
    mouseMove(event) {
        const currMousePos = { x: event.clientX, y: event.clientY }
        const mouseDiff = {
            x: currMousePos.x - this.prevMousePos.x,
            y: currMousePos.y - this.prevMousePos.y
        }
    
        // adjust rotation speed as needed
        const rotationSpeed = 0.005
    
        // update camera rotation based on mouse difference
        const euler = new THREE.Euler(0, 0, 0, 'XYZ')
        euler.setFromQuaternion(this.camera.quaternion.clone(), 'YXZ')
        euler.y -= mouseDiff.x * rotationSpeed
        euler.x -= mouseDiff.y * rotationSpeed
        euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x)) // limit pitch angle
        this.camera.quaternion.setFromEuler(euler)
    
        this.prevMousePos = currMousePos      
    }


      #calculateIdeal(x, y, z) {
        const ideal = new THREE.Vector3(x, y, z)
        const targetRotation = this.params.target.rotation.clone()

        if (this.#isFacingCamera(targetRotation)) {
          targetRotation.y += Math.PI
        } else {
          // Rotera kameran åt andra hållet
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
        const idealOffset = this.#calculateIdeal(-1, 2, -2)
        const idealLookat = this.#calculateIdeal(0, 1, 0) 
    
        const t = 1.0 - Math.pow(0.001, timeElapsed)
    
        this.currentPosition.lerp(idealOffset, t)
        this.currentLookat.lerp(idealLookat, t)
    
        this.camera.position.copy(this.currentPosition)
        this.camera.lookAt(this.currentLookat)
      }
    }