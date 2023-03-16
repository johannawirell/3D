import * as THREE from 'three'
import { GameEnity } from '../gameEnity/gameEnity'

import { Movement } from '../gameEnity/movement'

const PATH_TO_HORSE = '../../models/Daffy.glb'
const SCALE = 0.4

const X_POSITION = 50
const Y_POSITION = 0
const Z_POSITION = -100

export class HorseController extends GameEnity {
    velocity = new THREE.Vector3(0, 0, 2)
    currentPosition = new THREE.Vector3(X_POSITION, Y_POSITION, Z_POSITION)

    constructor(params) {
        super(params)
        this.move = false
        
        this.#loadHorse()
        // this.setState(states.walk)
        // this.loadGLTF(PATH_TO_HORSE, true)
        // console.log(this.states)
    }

    async #loadHorse() {
        await this.loadGLTF(PATH_TO_HORSE, true)
        this.setState(this.states.Walk)
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
    
    update(time) {
        if (this.move){
            this.moveModel(time)
        } else {
            this.idle()
        }

        if (this.mixer) {
            this.mixer.update(time)
        }
    }

   position(model) {
        if (model) {
            model.scale.set(SCALE, SCALE, SCALE)
            model.position.set(X_POSITION, Y_POSITION, Z_POSITION)
            model.rotateY(Math.PI)
        }
        return model
    }
}
