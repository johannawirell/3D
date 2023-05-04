import * as THREE from 'three'
import { HTMLElement } from './html'

export class ComputerDescription extends HTMLElement {
    constructor(params) {
        super(params)
        this.player = params.player
        this.handler
    }


    addContent() {
        const skills = [
            'Programmeringsspråk: JavaScript, HTML, CSS, Java, C++, Python',
            'Ramverk och bibliotek: React, Express.js, Angular, Three.js',
            'Versionshantering: Git, Github, Gitlab',
            'Databaser: MongoDB, MySQL',
            'Continuous Integration/Continuous Deployment (CI/CD): GitLab CI/CD, Github CI/CD',
            'Verktyg för testning: Jest, Mocha, Chai',
            'Utvecklingsmiljö: VS Code',
            'Webbserver: Nginx',
            'Operativssystem: macOS, Windows, Linux',
            'Docker och Kubernetes (k8s)'
        ]
        
        this.div = document.querySelector('.game-description-container')
        this.div.innerHTML = ''
        const h1 = document.createElement('h1')
        h1.textContent = 'Mina kompetenser:'

        const keyDescription = document.createElement('div')
        keyDescription.classList.add('info-list')
        const ul = document.createElement('ul')

        for (let i = 0; i < skills.length; i++) {
            const li = document.createElement('li');
            li.textContent = skills[i];
            ul.appendChild(li);
          }

        this.div.appendChild(h1)
        keyDescription.appendChild(ul)
        this.div.appendChild(keyDescription)
        
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