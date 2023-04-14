import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GameEnity } from '../../controllers/gameEnity/gameEnity.js'
import { GrassField } from './grassField.js'

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/')

const objects = [
  {
    name: 'Oak',
    path: '../../../models/Oak.glb',
    instances: 30
  },
  {
    name: 'Pine',
    path: '../../../models/Pine.glb',
    instances: 30
  },
  {
    name: 'Rock',
    path: '../../../models/Rock.glb',
    instances: 15
  }
]

export class Forrest extends GameEnity {
    emptyspace = 100

  constructor(params) {
    super(params)
    this.glbPaths = objects.map(obj => obj.path)
    this.loadingManager = params.loadingManager
    this.entityManager = params.entityManager
    this.instances = 70
    this.obstacles = []
    this.spheres = []
    this.grassField = new GrassField({
      scene: this.scene,
      loadingManager: this.loadingManager,
      entityManager: this.entityManager
    })

    this.#loadForrest()
  }

   getObstacles () {
      return this.obstacles
    }

    getSpheres() {
      return this.spheres
    }

  #loadForrest() {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const gltfLoader = new GLTFLoader(this.loadingManager)
    gltfLoader.setDRACOLoader(dracoLoader)

    this.forestObjects = []

    objects.forEach(obj => {
      gltfLoader.load(obj.path, gltf => {
        const model = gltf.scene

        for (let i = 0; i < obj.instances; i++) {
          let x = Math.random() * windowWidth - windowWidth / 2
          const z = Math.random() * windowHeight - windowHeight / 2
          let y = -1
         

          const clone = model.clone()

          clone.traverse(obj => {
            if (obj.isMesh) {
              obj.castShadow = true
            }
          })
          
          clone.name = obj.name
          clone.position.set(x, y, z)
          const scale = this.#generateRandomNumbers(3, 8)
          clone.scale.set(scale, scale, scale)
          const rotation = new THREE.Vector3(0, Math.random(), 0)
          clone.rotation.setFromVector3(rotation.multiplyScalar(Math.PI * 2))
          const obstacle = this.createObstacle(clone)
          this.spheres.push(this.sphere)
          
          this.obstacles.push(obstacle)

      
          this.scene.add(clone)
          this.forestObjects.push(clone)
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
