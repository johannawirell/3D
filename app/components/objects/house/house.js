import * as THREE from 'three'
import { GameEnity } from '../../controllers/gameEnity/gameEnity'
import { glassShader } from '../shaders/shader'

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


        this.target.traverse((child) => {
            if (child.name.includes('Window')) {
                child.material = new THREE.ShaderMaterial(glassShader)
            }
        })
    }

    getSphere() {
        return this.sphere
    }

   position(model) {
        if (model) {
            model.rotation.set(0, 0, Math.PI, 1)
            // model.scale.set(2, 2, 2)
            model.position.set(-20,1.1, -0)
        }
        return model
    }

    update(time) {
        if (this.mixer) {
            this.mixer.update(time)
        }
    }
}
