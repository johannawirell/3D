import * as THREE from 'three'
import { HTMLElement } from '../html/html'

export class LoadingManager {
    constructor(params) {
        this.loadingManager = new THREE.LoadingManager()
        this.isDone = false
        
        this.#addContent()
        this.#getLoaded()
        this.#handleProgress()
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

    #handleProgress() {
        console.log(this.progressBar)
        this.loadingManager.onProgress = (url, loaded, total) => {
            this.progressBar.value = (loaded / total) * 100
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

        this.progressBar = document.createElement('progress')
        this.progressBar.setAttribute('id', 'loading-bar')
        this.progressBar.setAttribute('value', '0')
        this.progressBar.setAttribute('max', '100')
        this.container.appendChild(this.progressBar)

        document.body.appendChild(this.container)
    }
}