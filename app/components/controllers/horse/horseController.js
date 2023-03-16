import * as THREE from 'three'
import * as YUKA from 'yuka'
import { GameEnity } from '../gameEnity/gameEnity'

const PATH_TO_HORSE = '../../models/Daffy.glb'
const SCALE = 0.4

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
        this.createVehicle()
        // TODO: Uppdatera path
        this.createPath([
            new YUKA.Vector3(-4, 0, -11),
            new YUKA.Vector3(4, 0, -11),
            new YUKA.Vector3(4, 0, 11),
            new YUKA.Vector3(-4, 0, 11)
        ], true)
        await this.loadGLTF(PATH_TO_HORSE)
        this.createLine()
    }

    get position() {
        return this.currentPosition
    }

    stopMovement() {
        this.move = false
    }

    startMovement() {
        this.move = true
    }   

    updatePosition() {
       
    }
    
    update(time) {
        if (this.isDoneLoading) {
            if (this.move){
                this.walk()
                this.updateEnity()
                
                // this.updatePosition()
            } else {
                this.idle()
            }
    
            if (this.mixer) {
                this.mixer.update(time)
            }
        }
      
    }

   position(model) {
        if (model) {
            model.scale.set(SCALE, SCALE, SCALE)
            model.position.set(X_POSITION, Y_POSITION, Z_POSITION)
            this.currentPosition = model.position
            model.rotateY(Math.PI)
        }
        return model
    }
}
