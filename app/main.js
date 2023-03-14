import './css/index.css'
import * as THREE from 'three'

import { PlayerController } from './components/controllers/player/playerController'
import { ThirdPersonCamera } from './components/controllers/player/thirdPersonCamera'
import { HorseController } from './components/controllers/horse/horseController'
import { Plane } from './components/objects/plane'
import { sky } from './components/objects/sky'
import { Tree } from './components/objects/tree'
import { GameDescrition } from './components/descriptions/gameDescription'
import { ambientLight, directionaLight } from './components/light'

const FIELD_OF_VIEW = 60
const ASPECT = window.innerWidth / window.innerHeight
const NEAR = 1.0
const FAR = 1000.0
const CAMERA_POSITION_X = 25
const CAMERA_POSITION_Y = 10
const CAMERA_POSITION_Z = 25
const NUMBER_OF_TREES = 10

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
    this.#createGameDescription()
  }

  #addEventListeners() {
    window.addEventListener('resize', () => {
      if (this.gameDescrition) {
        this.gameDescrition.updateWidthAndHeight(
          window.innerWidth / 2,
          window.innerHeight / 2
        )
      }
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

  #createGameDescription() {
    this.player.enableMovement()
    // this.gameDescrition = new GameDescrition({
    //   scene: this.scene,
    //   width: window.innerWidth / 2,
    //   height: window.innerHeight / 2
    // })

    // this.gameDescrition.handleStart(() => {
    //   this.player.enableMovement()
    //   this.gameDescrition.hide()
    //   this.gameDescrition = null
    // })
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

    if (this.gameDescrition) {
      this.gameDescrition.update(this.camera)
    }

    if (this.#isNearHorse()) {
      this.horse.stopMovement()
    } else {
      this.horse.startMovement()
    }
  }

  #isNearHorse() {
    
    const playerPosition = this.player.position
    const horsePosition = this.horse.position
    const distance = playerPosition.distanceTo(horsePosition)
    if (distance < 20) {
      return true
    } 
  }

  #loadAnimateModel() {
    this.player = new PlayerController({
      camera: this.camera,
      scene: this.scene,
      planePosition: this.plane.position,
      move: false
    })
    this.horse = new HorseController(this.camera, this.scene)
    this.thirdPersonCamera = new ThirdPersonCamera({
      camera: this.camera,
      target: this.player
    })
  }

  #createPlane() {
    this.plane = new Plane(this.scene)
    for (let i = 0; i < NUMBER_OF_TREES; i++) {
      new Tree(this.scene, { 
        scale: this.#generateRandomNumber(5, 3),
        x: this.#generateRandomNumber(200, -200),
        y: this.#generateRandomNumber(-4, -5),
        z: this.#generateRandomNumber(200, -200),
      })
    }
    new Tree(this.scene, { 
      scale: 5,
      x: 100,
      y: 100,
      z: 0
    })
  }

  #generateRandomNumber(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
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