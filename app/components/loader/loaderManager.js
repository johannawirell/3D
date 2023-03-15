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

        const label = document.createElement('label')
        label.textContent = 'Loading...'
        label.setAttribute('for', 'loading-bar')
        this.container.appendChild(label)

        const progressBar = document.createElement('progress')
        progressBar.setAttribute('id', 'loading-bar')
        progressBar.setAttribute('value', '0')
        progressBar.setAttribute('max', '100')
        this.container.appendChild(progressBar)

        document.body.appendChild(this.container)
    }
}