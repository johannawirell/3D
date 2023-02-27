import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
const PATH_TO_MODEL = '../../models/Soldier.glb'

const WIDTH = 5
const HEIGHT = 5
const DEPTH = 5

export class PlayerController {
    constructor() {
        this.pressedKeys = {}
        this.addEventListeners()
    }

    addEventListeners() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this))
        document.addEventListener('keyup', this.handleKeyUp.bind(this))
    }

    handleKeyDown(event) {
        this.pressedKeys[event.key.toLowerCase()] = true;
        console.log(this.model);
    }
    
    handleKeyUp(event) {
        this.pressedKeys[event.key.toLowerCase()] = false;
    }

    addPlayerTo(scene) {
        new GLTFLoader()
            .load(PATH_TO_MODEL, gltf => {
                const model = gltf.scene
                model.scale.set(WIDTH, HEIGHT, DEPTH)
                model.traverse(obj => {
                    if (obj.isMesh) {
                        obj.castShadow = true
                    }
                })
                scene.add(model)
            })
        return scene
    }
}


