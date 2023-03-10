import './css/index.css'
import * as THREE from 'three'

import { PlayerController } from './components/controllers/player/playerController'
import { ThirdPersonCamera } from './components/controllers/player/thirdPersonCamera'
import { HorseController } from './components/controllers/horse/horseController'
import { Plane } from './components/objects/plane'
import { sky } from './components/objects/sky'
import { StartDescrition } from './components/descriptions/startDescription'
import { ambientLight, directionaLight } from './components/light'

const FIELD_OF_VIEW = 60
const ASPECT = window.innerWidth / window.innerHeight
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
    this.isMouseMoving = false
    this.event

    this.#createPlane()
    this.#loadAnimateModel()
    this.#addEventListeners()
    this.#RAF()
    this.#createStartDescription()
  }

  #addEventListeners() {
    window.addEventListener('resize', () => {
       this.renderer.setSize(window.innerWidth, window.innerHeight) // Set to full screen
    })
    window.addEventListener('mousemove', e => {
      if (e.button === 1) {
        this.event = e
        this.isMouseMoving = true
      } else {
        this.event = null
        this.isMouseMoving = false
      }
    })

    window.addEventListener('mouseup', () => {
      this.isMouseMoving = false
      this.event = null
    })
  }

  #createStartDescription() {
    this.start = new StartDescrition({
      scene: this.scene,
      width: window.innerWidth,
      height: window.innerHeight
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

    if (this.horse) {
      this.horse.update(seconds)
    }

    if (this.thirdPersonCamera) {
      if (this.isMouseMoving) {
        this.thirdPersonCamera.mouseMove(this.event)
      } else {
        this.thirdPersonCamera.update(seconds)
      }
    }
  }

  #loadAnimateModel() {
    this.player = new PlayerController(this.camera, this.scene, this.plane.position)
    this.horse = new HorseController(this.camera, this.scene)
    this.thirdPersonCamera = new ThirdPersonCamera({
      camera: this.camera,
      target: this.player
    })
  }

  #createPlane() {
    this.plane = new Plane(this.scene)
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
    renderer.setSize(window.innerWidth, window.innerHeight) 
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
      directionaLight
    )

    scene.background = sky
  
    return scene
  }  
}

new Main()