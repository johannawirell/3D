import * as THREE from 'three'

export class ThirdPersonCamera {

    constructor(params) {
        this.params = params
        this.camera = params.camera
        this.target = params.target
        this.rotation = params.rotation
        this.position = params.position
        
        this.currentPosition = new THREE.Vector3()
        this.currentLookAt = new THREE.Vector3()
    }

    #calculateIdealOffset() {
        console.log(this.position)
        const idealOffset = new THREE.Vector3(-15, 20, -30)
        idealOffset.applyQuaternion(this.rotation)
        idealOffset.add(this.position)
        return idealOffset
    }

    // TODO refactor
    #calculateIdealLookat() {
        const idealLookat = new THREE.Vector3(0, 10, 50)
        idealLookat.applyQuaternion(this.rotation)
        idealLookat.add(this.position)
        return idealLookat
    }

    update(time) {
        const idealOffset = this.#calculateIdealOffset()
        const idealLookat = this.#calculateIdealLookat()
 
        const t = 1.0 - Math.pow(0.001, time)
    
        this.currentPosition.lerp(idealOffset, t)
        this.currentLookAt.lerp(idealLookat, t)
    
        this.camera.position.copy(this.currentPosition)
        this.camera.lookAt(this.currentLookat)
    }
}
