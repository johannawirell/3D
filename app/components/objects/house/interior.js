import { GameEnity } from "../../controllers/gameEnity/gameEnity"

const PATH_TO_INDOOR = '../../models/indoor.glb'

export class Interior extends GameEnity{
    constructor(params) {
        super(params)
        this.#loadHome()
    }

    async #loadHome() {
        await this.loadGLTF(PATH_TO_INDOOR)
        this.target.name = 'interior'
    }

    position(model) {
        return model
    }

}