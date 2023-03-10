import { Description } from './description'

export class GameDescrition extends Description {
    constructor(params) {
        super(params)
        this.#updateDiv()
    }

    #updateDiv() {
        this.div.classList.add('game-description')
        this.div.innerText = 'hej'
    }

    updateWidthAndHeight (newWidth, newHeight) {
        this.CSS2DRenderer.setSize(newWidth, newHeight)
    }

    addContent() {

    }
}