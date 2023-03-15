import * as THREE from 'three'

export class LoadingManager {
    constructor() {
        this.loadingManager = new THREE.LoadingManager()
        this.isDone = false

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
        }
    }
}