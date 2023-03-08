import './css/index.css'
import * as THREE from 'three'

import { PlayerController } from './components/controllers/player/playerController'
import { ThirdPersonCamera } from './components/controllers/player/thirdPersonCamera'
import { HorseController } from './components/controllers/horseController'
import { plane } from './components/objects/plane'
import { sky } from './components/objects/sky'
import { ambientLight, directionaLight } from './components/light'

const WINDOW_WIDTH = window.innerWidth
const WINDOW_HEIGHT = window.innerHeight
const FIELD_OF_VIEW = 60
const ASPECT = WINDOW_WIDTH / WINDOW_HEIGHT
const NEAR = 1.0
const FAR = 1000.0
const CAMERA_POSITION_X = 25
const CAMERA_POSITION_Y = 10
const CAMERA_POSITION_Z = 25

class Main {
  constructor() {
    this.renderer = this.#createRenderer()
    this.camera = this.#createPerspectiveCamera()
    this.scene = this.#createScene()
    this.mixers = []
    this.previousRAF = null

    this.#loadAnimateModel()
    this.#addEventListeners()
    this.#RAF()
  }

  #addEventListeners() {
    window.addEventListener('resize', () => {
       this.renderer.setSize(window.innerWidth, window.innerHeight) // Set to full screen
    })
  }

  #RAF() {
    requestAnimationFrame(time => {
      if (this.previousRAF === null) {
        this.previousRAF = time
      }

      this.#RAF()

      this.renderer.render(this.scene, this.camera)
      this.#update(time - this.previousRAF)
      this.previousRAF = time
    })
  }

  #update(time) {
    const seconds = time * 0.001
    if (this.mixers) {
      this.mixers.map(m => m.update(seconds))
    }
    if (this.player) {
      this.player.update(seconds) 
    }
    this.thirdPersonCamera.update(seconds)
  }

  #loadAnimateModel() {
    this.player = new PlayerController(this.camera, this.scene)
    this.thirdPersonCamera = new ThirdPersonCamera({
      camera: this.camera,
      target: this.player
    })
  }

  #createRenderer() {
    const renderer = new THREE.WebGL1Renderer({
      canvas: document.querySelector('#background'),
      antialias: true 
    })
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT) 
    return renderer
  }

  #createPerspectiveCamera() {
    const camera = new THREE.PerspectiveCamera(
      FIELD_OF_VIEW,
      ASPECT,
      NEAR,
      FAR
    )
    camera.position.set(CAMERA_POSITION_X, CAMERA_POSITION_Y, CAMERA_POSITION_Z)

    return camera
  }

  #createScene() {
    let scene = new THREE.Scene()

    scene.add(
      ambientLight,
      directionaLight,
      plane
    )

    scene.background = sky
  
    return scene
  }

  
}

new Main()