import * as YUKA from 'yuka'
import * as THREE from 'three'

import './css/index.css'

import { LoadingManager } from './components/loader/loaderManager'
import { PlayerController } from './components/controllers/player/playerController'
import { ThirdPersonCamera } from './components/controllers/player/thirdPersonCamera'
import { HorseController } from './components/controllers/horse/horseController'
import { Plane } from './components/objects/plane'
import { GameDescrition } from './components/html/gameDescription'
import { ambientLight, directionaLight } from './components/light'
import { DogController } from './components/controllers/dog/dogController'
import { House } from './components/objects/house/house'

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
    this.loadingManager = this.#createLoader()
    this.mixers = []
    this.previousRAF = null
    this.isMouseMoving = false
    this.event
    this.obstacles
    this.isNearHorse = false

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
        if (!this.obstacles) {
         this.#addObstaclesToHorse()
        }
        if (!this.addedSpheres) {
          this.#addObstaclesToPlayer()
        }
      } 

      this.#RAF()

    })
  }

  #addObstaclesToHorse() {
    this.obstacles = this.plane.getObstacles()
    this.horse.addObstacles(this.obstacles)
  }

  #addObstaclesToPlayer() {
      const obstacleSpheres = this.plane.getSpheres()
      this.horseSphere = this.horse.getSphere()
      this.dogSphere = this.dog.getSphere()
      if (this.horseSphere && this.dogSphere) {
        obstacleSpheres.push(this.horseSphere, this.dogSphere)
        this.player.addObstacleSpheres(obstacleSpheres)
        this.addedSpheres = true
        
      }
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

    if (this.dog) {
      this.dog.update(seconds)
    }

    if (this.house) {
      this.house.update(seconds)
    }

    const playerPosition = this.player.getPosition()
    const horsePosition = this.horse.getPosition()
    if (playerPosition.distanceTo(horsePosition) < 50) {
      if (!this.isNearHorse) {
        console.log('is near horse')
      }

      this.isNearHorse = true

    } else if (this.isNearHorse) {
      this.isNearHorse = false
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
  }

  #loadAnimateModel() {
    this.player = new PlayerController({
      camera: this.camera,
      scene: this.scene,
      planePosition: this.plane.position,
      entityManager: this.entityManager,
      move: false
    })
    this.horse = new HorseController({
      camera: this.camera, 
      scene: this.scene,
      entityManager: this.entityManager
    })
    this.dog = new DogController({
      camera: this.camera,
      scene: this.scene,
      entityManager: this.entityManager
    })
    this.thirdPersonCamera = new ThirdPersonCamera({
      camera: this.camera,
      target: this.player
    })
    this.house = new House({
      camera: this.camera,
      scene: this.scene
    })
  }

  #createPlane() {
    this.entityManager = new YUKA.EntityManager()
    this.plane = new Plane(this.scene, this.loadingManager.loader, this.entityManager)
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