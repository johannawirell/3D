import * as THREE from 'three'

export class ThirdPersonCamera {

    constructor(params) {
        this.params = params
        this.camera = params.camera
    
        this.currentPosition = new THREE.Vector3();
        this.currentLookat = new THREE.Vector3();
      }

      #calculateIdeal(x, y, z) {
        const ideal = new THREE.Vector3(x, y, z)
        ideal.applyQuaternion(this.params.target.rotation)
        ideal.add(this.params.target.position)
        return ideal
      }
   
      update(timeElapsed) {
        const idealOffset = this.#calculateIdeal(-15, 20, -30)
        const idealLookat = this.#calculateIdeal(0, 10, 50)

    
        const t = 1.0 - Math.pow(0.001, timeElapsed);
    
        this.currentPosition.lerp(idealOffset, t)
        this.currentLookat.lerp(idealLookat, t)
    
        this.camera.position.copy(this.currentPosition)
        this.camera.lookAt(this.currentLookat)
      }
    }
