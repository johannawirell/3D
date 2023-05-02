import * as THREE from 'three'
import { HTMLElement } from './html'

export class ComputerDescription extends HTMLElement {
    constructor(params) {
        super(params)
        this.player = params.player
        this.handler
        this.#updateDiv()
    }

    #updateDiv() {
        this.div.classList.add('computer-description-container')
    }


    addContent() {
        this.div = document.querySelector('.game-description-container')
        this.div.innerHTML = ''
        const h1 = document.createElement('h1')
        h1.textContent = 'Dessa programmeringspråk kan jag'

      

        this.button = document.createElement('button')
        this.button.textContent = 'OK'

        this.div.appendChild(h1)

        this.div.appendChild(this.button)
    }

    update(camera) {
        this.CSS2DRenderer.render(this.scene, camera)
        this.div.style.transform = `translate(0%, 0%)`
        this.div.style.top = '0'
        this.div.style.left = ' 0'

    }


}