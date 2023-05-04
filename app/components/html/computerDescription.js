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
      
        // Hämta spelarens position och rotation
        const playerPosition = this.player.target.position
        const playerRotation = this.player.target.rotation.y
        // Skapa en vektor som pekar framåt från spelarens position
        const forward = new THREE.Vector3(0, 0, -1)
        forward.applyEuler(new THREE.Euler(0, playerRotation, 0))
        const position = playerPosition.clone().add(forward.multiplyScalar(2))
      
        // Positionera rutan vid vektorn som pekar framåt från spelaren
        this.div.style.transform = `translate(${position.x}px, ${position.y}px)`
        this.div.style.top = '0'
        this.div.style.left = '0'
      }
      


}