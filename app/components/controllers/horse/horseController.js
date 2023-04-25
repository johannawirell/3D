import * as THREE from 'three'
import * as YUKA from 'yuka'
import { degToRad } from 'three/src/math/MathUtils.js'
import { GameEnity } from '../gameEnity/gameEnity'

const PATH_TO_HORSE = '../../models/horse.glb'

const X_POSITION = 0
const Y_POSITION = 0
const Z_POSITION = 0

export class HorseController extends GameEnity {
    velocity = new THREE.Vector3(0, 0, 2)
    currentPosition = new THREE.Vector3(X_POSITION, Y_POSITION, Z_POSITION)

    constructor(params) {
        super(params)
        this.move = true
        
        this.#loadHorse()
    }

    getSphere() {
        return this.sphere
    }
 
    async #loadHorse() {
        this.vehicle = this.createVehicle({
            scale: 1,
            rotation: Math.PI / 2,
            boundingRadius: 30
        })
        this.path = this.createPath(this.#createCirclePath(), true)
        await this.loadGLTF(PATH_TO_HORSE)
        this.target.name = 'Horse'
    }

    #createCirclePath() {
        this.waypoints = []
        const radius = 100
        const center = new YUKA.Vector3(0, 0, 0)
        for (let i = 0; i <= 360; i += 10) {
            const angle = degToRad(i)
            const x = Math.sin(angle) * radius + center.x
            const y = center.y
            const z = Math.cos(angle) * radius + center.z
            this.waypoints.push(new YUKA.Vector3(x, y, z))
        }

        return this.waypoints
    }

    getPosition() {
        return this.currentPosition
    }

    stopMovement() {
        if (this.isDoneLoading) {
            this.move = false
            this.stopVehicle()
        }
    }

    startMovement() {
        if (this.isDoneLoading) {
            this.move = true
            this.startVehicle()
        }
    }   
      
    
    update(time) {
        if (this.isDoneLoading) {
            if (this.move) {
                this.updatePosition(this.vehicle.position)
                this.walk(time)
                this.updateEnity()
              
            } else {
                this.vehicle
                this.updateEnity()
                this.stopedAt = this.currentPosition
            }
    
            if (this.mixer) {
                this.mixer.update(time)
            }
        }
    }

   position(model) {
        if (model) {
            this.currentPosition = this.waypoints[0]
            model.rotation.set(0, 0, Math.PI, 1)
            model.position.set(0, 0, 100)
        }
        return model
    }
}
