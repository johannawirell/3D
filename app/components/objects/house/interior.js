import { GameEnity } from "../../controllers/gameEnity/gameEnity"

const PATH_TO_INDOOR = '../../models/indoor.glb'

export class Interior extends GameEnity{
    constructor(params) {
        super(params)
        this.computerPromise = this.#loadHome()
    }

    async #loadHome() {
        await this.loadGLTF(PATH_TO_INDOOR)
        this.target.name = 'interior'
        this.computer = this.target.children.find(obj => obj.name === 'computer')
    }

    position(model) {
        return model
    }

    async getComputerPosition() {
        await this.computerPromise
        return this.computer.position
    }

}