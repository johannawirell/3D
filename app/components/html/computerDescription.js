import * as THREE from 'three'
import { HTMLElement } from './html'

export class ComputerDescription extends HTMLElement {
    constructor(params) {
        super(params)
        this.player = params.player
        this.handler
    }


    addContent() {
        this.div = document.querySelector('.game-description-container')
        this.div.innerHTML = ''
        const h1 = document.createElement('h1')
        h1.textContent = 'Dessa programmeringspråk kan jag'

        this.div.appendChild(h1)
    }

    hide() {
        this.div.classList.add('hidden')
    }

    show() {
        this.div.classList.remove('hidden')
    }

    update(camera) {
        this.CSS2DRenderer.render(this.scene, camera)
      
        const playerPosition = this.player.target.position
        const playerRotation = this.player.target.rotation.y
        const forward = new THREE.Vector3(0, 0, -1)
        forward.applyEuler(new THREE.Euler(0, playerRotation, 0))
        const position = playerPosition.clone().add(forward.multiplyScalar(2))
      
        this.div.style.transform = `translate(${position.x}px, ${position.y}px)`
        this.div.style.top = '0'
        this.div.style.left = '0'
      }
}