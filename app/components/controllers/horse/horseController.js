import * as THREE from 'three'
import * as YUKA from 'yuka'
import { degToRad } from 'three/src/math/MathUtils.js'
import { GameEnity } from '../gameEnity/gameEnity'

const PATH_TO_HORSE = '../../models/horse.glb'
const SCALE = 1

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

    async #loadHorse() {
        this.vehicle = this.createVehicle({
            scale: SCALE,
            rotation: Math.PI / 2,
            boundingRadius: 20
        })
        this.path = this.createPath(this.#createCirclePath(), true)
        await this.loadGLTF(PATH_TO_HORSE)
    }

    #createCirclePath() {
        this.waypoints = []
        const radius = 200
        const center = new YUKA.Vector3(10, 0, 100)
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
        this.move = false
        this.stopVechicle()
    }

    startMovement() {
        this.move = true
        this.startVechicle()
    }   
      
    
    update(time) {
        if (this.isDoneLoading) {
            if (this.move) {
                if (this.stopedAt) {
                    if (this.vehicle.position.distanceTo(this.stopedAt) > 1) {
                        this.vehicle.position.copy(this.stopedAt)
                        this.sphere.position.copy(this.stopedAt)
                    }
                }
            
                this.updatePosition(this.vehicle.position)
                this.walk(time)
                this.updateEnity()
            } else {
                this.idle()
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
        }
        return model
    }
}
