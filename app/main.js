import * as YUKA from 'yuka'
import * as THREE from 'three'

import './css/index.css'

import { LoadingManager } from './components/loader/loaderManager'
import { PlayerController } from './components/controllers/player/playerController'
import { ThirdPersonCamera } from './components/controllers/player/thirdPersonCamera'
import { Plane } from './components/objects/plane/plane'
import { GameDescrition } from './components/html/gameDescription'
import { ambientLight, directionaLight } from './components/objects/light'

import { Outdoors } from './outdoors'
import { Indoors } from './indoors'

const FIELD_OF_VIEW = 60
const ASPECT = window.innerWidth / window.innerHeight
const NEAR = 1.0
const FAR = 1000.0
const CAMERA_POSITION_X = 25
const CAMERA_POSITION_Y = 10
const CAMERA_POSITION_Z = 25

export class Main {
  constructor() {
    this.renderer = this.#createRenderer()
    this.camera = this.#createPerspectiveCamera()
    this.scene = this.#createScene()
    this.loadingManager = this.#createLoader()
    this.mixers = []
    this.previousRAF = null
    this.isMouseMoving = false
    this.event
    this.obstacles
    
    this.entityManager = new YUKA.EntityManager()

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
    this.gameDescrition = new GameDescrition({
      scene: this.scene,
      width: window.innerWidth / 2,
      height: window.innerHeight / 2
    })

    this.gameDescrition.handleStart(() => {
      this.player.enableMovement()
      this.gameDescrition.hide()
      this.gameDescrition = null
    })
  }

  #RAF() {
    requestAnimationFrame(time => {
      if (this.previousRAF === null) {
        this.previousRAF = time
      }

      if (this.loadingManager.isDoneLoading) {
        this.renderer.render(this.scene, this.camera)
        this.#update(time - this.previousRAF)
        this.previousRAF = time
      } 

      this.#RAF()
    })
  }

  #update(time) {
    const seconds = time * 0.001
    if (this.gameDescrition) {
      this.gameDescrition.update(this.camera)
    }
    if (this.player) {
      this.player.update(seconds) 
    }
    if (this.thirdPersonCamera) {
      if (this.isMouseMoving) {
        this.thirdPersonCamera.mouseMove(this.event)
      } else {
        this.thirdPersonCamera.update(seconds)
      }
    }
    if (this.mixers) {
      this.mixers.map(m => m.update(seconds))
    }

    if (this.outdoors) {
      this.outdoors.update(time)
    }
    if (this.indoors) {
      this.indoors.update(time)
    }
  }

  #loadAnimateModel() {
    this.player = new PlayerController({
      camera: this.camera,
      scene: this.scene,
      planePosition: this.plane.position,
      entityManager: this.entityManager,
      move: false
    })
   
    this.thirdPersonCamera = new ThirdPersonCamera({
      camera: this.camera,
      target: this.player
    })

    // this.indoors = new Indoors({
    //   camera: this.camera,
    //   scene: this.scene,
    //   plane: this.plane,
    //   player: this.player,
    //   loading: this.loadingManager
    // })

    this.outdoors = new Outdoors({
      camera: this.camera,
      scene: this.scene,
      plane: this.plane,
      player: this.player,
      entityManager: this.entityManager,
    })
  }

  #createPlane() {
    this.plane = new Plane({
      scene: this.scene,
      loadingManager: this.loadingManager.loader,
      entityManager: this.entityManager,
    })

    this.plane.createOutdoorPlane()
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
  
    return scene
  }  

  #createLoader() {
    return new LoadingManager({
      scene: this.scene,
      width: window.innerWidth / 2,
      height: window.innerHeight / 2
    })
  }
}

new Main()