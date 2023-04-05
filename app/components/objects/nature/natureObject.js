import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GameEnity } from '../../controllers/gameEnity/gameEnity'

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/')

export class NatureObject extends GameEnity {
    constructor(params) {
        super(params)
        this.glbPath = params.glbPath
        this.loadingManager = params.loadingManager
        this.entityManager = params.entityManager
        this.instances = params.instances

        this.#loadTree()
    }

    #loadTree() {
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
        const gltfLoader = new GLTFLoader(this.loadingManager)
        gltfLoader.setDRACOLoader(dracoLoader)

        gltfLoader.load(this.glbPath, gltf => {
            const model = gltf.scene

            const positions = []
            for (let i = 0; i < this.instances; i++) {
                const x = Math.random() * windowWidth - windowWidth / 2
                const z = Math.random() * windowHeight - windowHeight / 2
                let y = 0
                let positionIsValid = false
                
                while (!positionIsValid) {
                    y += 0.1
                    positionIsValid = true
                    for (let j = 0; j < positions.length; j++) {
                        const dx = x - positions[j].x
                        const dy = y - positions[j].y
                        const dz = z - positions[j].z
                        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
                        if (distance < 5) {
                            positionIsValid = false
                            break
                        }
                    }
                }
                positions.push({x, y, z})

                const clone = model.clone()
                this.getBoundingSphereForGLTF(clone)
                this.obstacle = this.createObstacle()

                clone.traverse(obj => {
                    if (obj.isMesh) {
                        obj.castShadow = true
                    }
                })
                clone.name = 'Tree'
                clone.position.set(x, y, z)

                this.scene.add(clone)
            }
        })
    }
}