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
        const h1 = document.createElement('h1')
        h1.textContent = 'Välkommen till Johanna Wirells CV spel'

        const descriptionDiv = document.createElement('div')
        descriptionDiv.classList.add('description')
        const p1 = document.createElement('p')
        p1.textContent = 'Flytta spelaren runt på skärmen för att se hur mitt liv ser ut.'
        descriptionDiv.appendChild(p1)
        const p2 = document.createElement('p')
        p2.textContent = 'Du flyttar spelaren enligt nedan beskrivning:'
        descriptionDiv.appendChild(p2)

        const keyDescription = document.createElement('div')
        keyDescription.classList.add('description-keys')
        const p3 = document.createElement('p')
        p3.textContent = 'w - Framåt'
        keyDescription.appendChild(p3)
        const p4 = document.createElement('p')
        p4.textContent = 's - Bakåt'
        keyDescription.appendChild(p4)
        const p5 = document.createElement('p')
        p5.textContent = 'd - Höger'
        keyDescription.appendChild(p5)
        const p6 = document.createElement('p')
        p6.textContent = 'a - Vänster'
        keyDescription.appendChild(p6)
        const p7 = document.createElement('p')
        p7.textContent = 'shift - Spring'
        keyDescription.appendChild(p7)
        const p8 = document.createElement('p')
        p8.textContent = 'space - hoppa'
        keyDescription.appendChild(p8)

        descriptionDiv.appendChild(keyDescription)

        const p9 = document.createElement('p')
        p9.textContent = '... och akta dig för monstret!'
        descriptionDiv.appendChild(p9)

        const button = document.createElement('button')
        button.textContent = 'Starta'

        this.div.appendChild(h1)
        this.div.appendChild(descriptionDiv)
        this.div.appendChild(button)

    }
}