import * as THREE from 'three'

const CAMERA_POSITION_X = import.meta.env.VITE_CAMERA_POSITION_X
const CAMERA_POSITION_Y = import.meta.env.VITE_CAMERA_POSITION_Y
const CAMERA_POSITION_Z = import.meta.env.VITE_CAMERA_POSITION_Z

export class ThirdPersonCamera {
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
        

        // this.camera.lookAt(this.model.position)

    }

      // #updateCameraTarget(moveX, moveZ) {
    //     this.camera.position.x += moveX
    //     this.camera.position.z += moveZ

    //     this.cameraTarget.x = this.model.position.x
    //     this.cameraTarget.y = this.model.position.y + 1
    //     this.cameraTarget.z = this.model.position.z
    //     this.orbitControl.target = this.cameraTarget
    // }

    // #updateCameraPosition() {
    //     const cameraOffset = new THREE.Vector3(
    //         CAMERA_POSITION_X,
    //         CAMERA_POSITION_Y,
    //         CAMERA_POSITION_Z
    //     )
    //     // this.camera.position.copy(this.model.position).add(cameraOffset)
    //     // this.cameraTarget.copy(this.model.position)
    //     // this.orbitControl.target = this.cameraTarget
    //     cameraOffset.applyAxisAngle(this.rotateAngle, this.#calculateCameraPosition())

    //     // Set camera position and target
    //     this.camera.position.copy(this.model.position).add(cameraOffset)
    //     this.camera.lookAt(this.model.position)
    // } 
}