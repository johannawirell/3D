import { Description } from './description'

export class GameDescrition extends Description {
    constructor(params) {
        super(params)
        this.#updateDiv()
    }

    #updateDiv() {
        console.log(this.div)
        this.div.classList.add('game-description')
        this.div.innerText = 'hej'
    }
}