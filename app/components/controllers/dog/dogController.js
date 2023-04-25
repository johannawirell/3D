import * as THREE from 'three'
import { HorseController } from '../horse/horseController'
import { GameEnity } from '../gameEnity/gameEnity'

const PATH_TO_DOG= '../../models/tindra.glb'

const X_POSITION = 0
const Y_POSITION = 0
const Z_POSITION = 0

export class DogController extends GameEnity {
    velocity = new THREE.Vector3(0, 0, 2)
    currentPosition = new THREE.Vector3(X_POSITION, Y_POSITION, Z_POSITION)

    constructor(params) {
        super(params)
        this.move = true
        
        this.#loadDog()
    }

    async #loadDog() {
        await this.loadGLTF(PATH_TO_DOG)
        this.target.name = 'dog'
    }



   position(model) {
        if (model) {
            model.rotation.set(0, 0, Math.PI, 1)
        }
        return model
    }
}
