import { Description } from './description'

export class GameDescrition extends Description {
    constructor(params) {
        super(params)
        this.#updateDiv()
    }

    #updateDiv() {
        this.div.classList.add('game-description-container')
    }

    updateWidthAndHeight (newWidth, newHeight) {
        this.CSS2DRenderer.setSize(newWidth, newHeight)
    }

    addContent() {
        // Skapa en h1-element
        const h1 = document.createElement('h1')
        h1.textContent = 'Välkommen till Johanna Wirells CV spel'

        // Skapa ett p-element
        const p = document.createElement('p')
        p.textContent = 'Flytta spelaren runt på skärmen för att se hur mitt liv ser ut.'

        // Skapa en button-element
        const button = document.createElement('button')
        button.textContent = 'Starta'

        // Lägg till elementen till dokumentet
        this.div.appendChild(h1)
        this.div.appendChild(p)
        this.div.appendChild(button)

    }
}