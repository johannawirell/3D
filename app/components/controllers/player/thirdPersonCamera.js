import * as THREE from 'three'

export class ThirdPersonCamera {
    direction = new THREE.Vector3()
    constructor(camera, model) {
        this.camera = camera
        this.model = model
        

    }

    getWorldDirection(direction) {
        return this.camera.getWorldDirection(direction)
    }

    calculateCameraPosition() {
        return Math.atan2(
            (this.camera.position.x - this.model.position.x), 
            (this.camera.position.z - this.model.position.z)
        )
    }

    move() {
        const cameraOffset = new THREE.Vector3(20, 10, 0)
        const newCameraPosition = this.model.position.clone().add(cameraOffset)
        newCameraPosition.addScaledVector(
            this.direction, 500, 500
            // -10,
            // // 1 * Math.sin(this.direction.y),
            // 20 * Math.cos(this.direction.y
        )

        this.camera.position.copy(newCameraPosition)
        this.camera.lookAt(this.model.position)
    }
    //     const cameraOffset = new THREE.Vector3(20, 10, 0)
    //     // this.camera.position.copy(this.model.posiwtion).add(cameraOffset)
    //     this.camera.lookAt(this.model.position)
    // }
}
