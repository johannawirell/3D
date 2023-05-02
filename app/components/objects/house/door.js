import * as THREE from 'three'
import { GameEnity } from "../../controllers/gameEnity/gameEnity";

const PATH_TO_DOOR = '../../models/door.glb'

export class Door extends GameEnity {
    currentState = null
    constructor(params) {
        super(params)
        this.#loadDoor()
    }

    async #loadDoor() {
        await this.loadGLTF(PATH_TO_DOOR)
        this.target.name = 'door'
    }

    getPosition() {
        if (this.target) {
            return this.target.position
        }
    }

    open() {
        const newAction = this.states.DoorAction

        if (this.currentState !== newAction) {
            this.#updateAnimation(newAction)
        }
    }

    #updateAnimation(newAction) {
        const toPlay = this.animationsMap.get(newAction)
        toPlay.play()
        this.setState(newAction)
    }


    update(time) {
        if (this.mixer) {
            this.open()
            this.mixer.update(time)
        }
    }

    position(model) {
        model.scale.set(2, 2, 2)
        model.position.set(50, 0, 20)

        return model
    } 


}