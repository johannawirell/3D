import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GameEnity } from '../../controllers/gameEnity/gameEnity'
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/')

const grass = {
    name: 'Grass',
    path: '../../../models/Grass.glb',
}

export class GrassField extends GameEnity{
    constructor(params) {
        super(params)
        this.loadingManager = params.loadingManager
        this.field = this.#createField()
    }

    #createField() {
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
        const gltfLoader = new GLTFLoader(this.loadingManager)
        gltfLoader.setDRACOLoader(dracoLoader)

        gltfLoader.load(grass.path, gltf => {
            console.log(gltf)
            console.log(this.scene)
        })
    }
}