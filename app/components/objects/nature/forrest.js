import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GameEnity } from '../../controllers/gameEnity/gameEnity.js'

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/')

const TREES = [
  {
    name: 'Oak',
    path: '../../../models/Oak.glb',
  },
  {
    name: 'Pine',
    path: '../../../models/Pine.glb',
  },
]

export class Forrest extends GameEnity {
    emptyspace = 100

  constructor(params) {
    super(params)
    this.glbPaths = TREES.map(tree => tree.path)
    this.loadingManager = params.loadingManager
    this.entityManager = params.entityManager
    this.instances = 70

    this.#loadForrest()
  }

  #loadForrest() {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const gltfLoader = new GLTFLoader(this.loadingManager)
    gltfLoader.setDRACOLoader(dracoLoader)

    const trees = []

    TREES.forEach(tree => {
      gltfLoader.load(tree.path, gltf => {
        const model = gltf.scene

        for (let i = 0; i < this.instances; i++) {
          let x = Math.random() * windowWidth - windowWidth / 2
          const z = Math.random() * windowHeight - windowHeight / 2
          let y = 0
          let positionIsValid = false

          while (!positionIsValid) {
            x += 0.1
            positionIsValid = true

            if (Math.abs(x) < this.emptyspace / 2) {
                positionIsValid = false
                continue
            }

            for (let j = 0; j < trees.length; j++) {
              const otherTree = trees[j]
              const dx = x - otherTree.position.x
              const dy = y - otherTree.position.y
              const dz = z - otherTree.position.z
              const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

              if (distance < 50) {
                positionIsValid = false
                break
              }
            }
          }

          const clone = model.clone()
          this.getBoundingSphereForGLTF(clone)
          this.obstacle = this.createObstacle()
          clone.traverse(obj => {
            if (obj.isMesh) {
              obj.castShadow = true
            }
          })
          clone.name = tree.name
          clone.position.set(x, y, z)
          const scale = this.#generateRandomNumbers(5, 10)
          clone.scale.set(scale, scale, scale)

          trees.push(clone)
          this.scene.add(clone)
        }
      })
    })
  }

  #generateRandomNumbers(min, max) {
    const middle = (min + max) / 2

    let number
    const rand = Math.random()

    if (rand < 0.2) {
        number = Math.floor(Math.random() * (middle - min + 1) + min)
    } else if (rand > 0.8) {
        number = Math.floor(Math.random() * (max - middle + 1) + middle)
    } else {
        const lower = Math.floor(Math.random() * (middle - min + 1) + min)
        const upper = Math.floor(Math.random() * (max - middle + 1) + middle)
        number = Math.random() < 0.5 ? lower : upper
    }

    return number
  }
}
