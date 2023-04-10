import * as THREE from 'three'
import { GameEnity } from '../gameEnity/gameEnity.js'
import { InputController } from './inputController.js'

const PATH_TO_PLAYER = '../../models/Soldier.glb'
const PLAYER_SCALE_VECTOR = new THREE.Vector3(5, 5, 5)

export class PlayerController extends GameEnity {
    deceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0)
    acceleration = new THREE.Vector3(1, 0.25, 15.0)
    velocity = new THREE.Vector3(0, 0, 0)
    currentPosition = new THREE.Vector3()

    constructor(params) {
        super(params)
        this.planePosition = params.planePosition
        this.inputController = new InputController()      
    
        this.#loadPlayer()
    }

    async #loadPlayer() {
        await this.loadGLTF(PATH_TO_PLAYER, false)
    }

    position(model) {
        if (model) {
            model.scale.copy(PLAYER_SCALE_VECTOR)       
        }
        return model
    }

    getPosition() {
        return this.currentPosition
    }
    
    getRotation() {
        if (!this.target) {
            return new THREE.Quaternion()
        } else {
            return this.target.quaternion
        }
    }

    enableMovement() {
        this.move = true
    }  

    update(time) {
        if (this.isDoneLoading && this.move) {
            if (this.#shouldMove()) {
                this.#animatePlayer()
                this.#handleMovement(time)
            } else {
                this.idle()
            }

            if (this.sphereMesh) {
                this.sphereMesh.position.copy(this.currentPosition)
            }
        }

        if (this.mixer) {
            this.mixer.update(time)
        }
    }

    #shouldMove() {
        return this.inputController.isDirectionsPressed()
    }

    #animatePlayer() {
        const shiftPressed = this.inputController.isShiftPressed()

        if (shiftPressed) {
            this.run()
        } else {
            this.walk()
        }
    }

    #handleMovement(time) {
        const velocity = this.#updateVelocity(time)

        const controlObject = this.target
        let rotation = controlObject.quaternion.clone()
        const acceleration = this.acceleration.clone()


        if (this.inputController.isTurning()) {
            rotation = this.#turn(time, rotation, acceleration)
        }

        if (this.inputController.isMovingForwards()) {
            this.#move(time, velocity, acceleration, true)
        } else if (this.inputController.isMovingBackwards()) {
            this.#move(time, velocity, acceleration, false)
        }

        this.#updatePosition(time, rotation, velocity, controlObject)       
    }

    #updatePosition(time, rotation, velocity, controlObject) {
        if (this.#isOverEdge()) {
            this.#handleOverEdge(controlObject, velocity)
        } else if (this.#isColliding()) {
            console.log('collision')
        } else {
            controlObject.quaternion.copy(rotation)
            
            const forward = new THREE.Vector3(0, 0, 1)
            forward.applyQuaternion(controlObject.quaternion)
            forward.normalize()
            
            const sideways = new THREE.Vector3(1, 0, 0)
            sideways.applyQuaternion(controlObject.quaternion)
            sideways.normalize()
            
            sideways.multiplyScalar(velocity.x * time)
            forward.multiplyScalar(velocity.z * time)
            
            controlObject.position.add(forward)
            controlObject.position.add(sideways)

            this.currentPosition.copy(controlObject.position)
            this.sphere.position.copy(controlObject.position)
        }
    }

    #isOverEdge() {
        return (
            this.#isOverNegativeZ() || this.#isOverPositiveZ() ||
            this.#isOverNegativeX() || this.#isOverPositiveX()
        )
    }

    #handleOverEdge(controlObject, velocity) {
        if (this.#isOverNegativeZ()) {
            velocity.z *= -1
            controlObject.position.z = (this.planePosition.z) * -1
        } else if (this.#isOverPositiveZ()) {
            velocity.z *= -1
            controlObject.position.z = this.planePosition.z
        } else if (this.#isOverNegativeX()) {
            velocity.x *= -1
            controlObject.position.x = (this.planePosition.x) * -1
        } else if (this.#isOverPositiveX()) {
            velocity.x *= -1
            controlObject.position.x = this.planePosition.x
        }
        this.currentPosition.copy(controlObject.position)
    }

    #isOverNegativeZ() {
        return this.currentPosition.z < (this.planePosition.z) * -1
    }

    #isOverPositiveZ() {
        return this.currentPosition.z > this.planePosition.z
    }

    #isOverNegativeX() {
        return this.currentPosition.x < (this.planePosition.x) * -1
    }

    #isOverPositiveX() {
        return this.currentPosition.x > this.planePosition.x
    }

    #isColliding() {
        const playerSphere = this.sphere.position
        const obstacleSpheres = this.obstacleSpheres.map(sphere => sphere.position)
        const minDistance = 10

        for (const obstacle of obstacleSpheres) {
            const distanceToPlayer = obstacle.distanceTo(playerSphere)
            if (distanceToPlayer <= minDistance) {
                return true
            }
        }
        return false
    }

    #spatialPartitioning() {

    }

    #move(time, velocity, acceleration, forwards) {
        if (forwards) {
            if (this.inputController.isRunning()) {
                acceleration.multiplyScalar(10.0)
            }
            velocity.z -= acceleration.z * time
        } else {
            velocity.z += acceleration.z * time
        }
    }

    #turn(time, rotation, acceleration) {
        const quaternion = new THREE.Quaternion()
        const axis = new THREE.Vector3()

        if (this.inputController.isTurningLeft()) {
            axis.set(0, 1, 0)
            quaternion.setFromAxisAngle(
                axis, 
                4.0 * Math.PI * time * acceleration.y
            )
            rotation.multiply(quaternion)
        }

        if (this.inputController.isTurningRight()) {
            axis.set(0, 1, 0)
            quaternion.setFromAxisAngle(
                axis,
                4.0 * - Math.PI * time * acceleration.y
            )
            rotation.multiply(quaternion)
          }

        return rotation
    }

    #updateVelocity(time) {
        const deceleration = this.deceleration
        const velocity = this.velocity
        
        const frameDeceleration = new THREE.Vector3(
            velocity.x * deceleration.x,
            velocity.y * deceleration.y,
            velocity.z * deceleration.z
        )

        frameDeceleration.multiplyScalar(time)
        
        frameDeceleration.z = Math.sign(frameDeceleration.z) * Math.min(
            Math.abs(frameDeceleration.z),
            Math.abs(velocity.z)
        )
        
        velocity.add(frameDeceleration)
        return velocity
    }  
}
