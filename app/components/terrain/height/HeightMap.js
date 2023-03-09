import * as THREE from 'three'
import { Noise } from 'noisejs'

export class HeightMap {
    constructor(width, height, minHeight, maxHeight) {
        this.width = width
        this.height = height
        this.minHeight = minHeight
        this.maxHeight = maxHeight
        this.noise = new Noise() 

        this.#generateHeight()
    }

    #generateHeight() {
        const area = this.width * this.height
        this.data = new Uint8Array(area)
        const scale = (this.maxHeight - this.minHeight) / 256

        for (let i = 0; i < area; i++) {
            const x = i % this.width
            const y = Math.floor(i / this.width)
            this.data[i] = Math.floor(this.minHeight + this.noise.simplex2(x / 100, y / 100) * scale)
        }
    }

    get heightdata() {
        return this.data
    }
}