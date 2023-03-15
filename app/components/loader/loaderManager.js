import * as THREE from 'three'
import { HTMLElement } from '../html/html'

export class LoadingManager {
    constructor(params) {
        this.loadingManager = new THREE.LoadingManager()
        this.isDone = false
        
        this.#addContent()
        this.#getLoaded()
    }

    get loader () {
        return this.loadingManager
    }

    get isDoneLoading() {
        return this.isDone
    }

    #getLoaded () {
        this.loadingManager.onLoad = () => {
            this.isDone = true
            this.#hide()
        }
    }

    #hide() {
        this.container.style.display = 'none'
    }

    #addContent() {
        this.container = document.createElement('div')
        this.container.classList.add('loader')
        const p = document.createElement('p')
        p.textContent = 'Loading...'
        this.container.appendChild(p)

        document.body.appendChild(this.container)

    }
}