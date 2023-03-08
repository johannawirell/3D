import * as THREE from 'three'

export class ThirdPersonCamera {

    constructor(params) {
        this.params = params
        this.camera = params.camera
    
        this.currentPosition = new THREE.Vector3()
        this.currentLookat = new THREE.Vector3()

        // Lägg till en lyssnare för "wheel" händelsen
        document.addEventListener('wheel', this.#onMouseWheel.bind(this))
      }

      #calculateIdeal(x, y, z) {
        const ideal = new THREE.Vector3(x, y, z)
        const targetRotation = this.params.target.rotation.clone()
        targetRotation.y += Math.PI // Rotera 180 grader för att få en bakifrånvy
        ideal.applyQuaternion(targetRotation)
        ideal.add(this.params.target.position)
        return ideal
      }
   
      update(timeElapsed) {
        const idealOffset = this.#calculateIdeal(-1, 2, -2)
        const idealLookat = this.#calculateIdeal(0, 1, 0)
  
    
        const t = 1.0 - Math.pow(0.001, timeElapsed);
    
        this.currentPosition.lerp(idealOffset, t)
        this.currentLookat.lerp(idealLookat, t)
    
        this.camera.position.copy(this.currentPosition)
        this.camera.lookAt(this.currentLookat)
      }

      #onMouseWheel(e) {
        const delta = e.deltaY
        const zoomStep = 2
        const idealOffset = this.#calculateIdeal(-1 - (delta / 100) * zoomStep, 2, -2 - (delta / 100) * zoomStep)
        this.currentPosition.copy(idealOffset)
      }
    }
