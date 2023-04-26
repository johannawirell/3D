import * as THREE from 'three'
import { GameEnity } from '../../controllers/gameEnity/gameEnity'

const PATH_TO_HOUSE= '../../../models/house.glb'

export class House extends GameEnity {

    constructor(params) {
        super(params)
        this.move = true
        
        this.#loadHouse()
    }

    async #loadHouse() {
        await this.loadGLTF(PATH_TO_HOUSE)
        const doorAction = this.animationsMap.get('DoorAction')
        doorAction.play()
    }

    getSphere() {
        return this.sphere
    }

   position(model) {
        if (model) {
            model.rotation.set(0, 0, Math.PI, 1)
            // model.scale.set(0.5, 0.5, 0.5)
            model.position.set(-20, 0, -0)
        }
        return model
    }

    update(time) {
        if (this.mixer) {
            this.mixer.update(time)
        }
    }
}
