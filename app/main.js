import './css/index.css'
import * as THREE from 'three'
import { AnimationMixer } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { PlayerController } from './components/controllers/player/playerController'
import { HorseController } from './components/controllers/horseController'
import { plane } from './components/objects/plane'
import {
  light,
  pointLight,
  ambientLight
} from './components/light'

const FIELD_OF_VIEW = 60
const ASPECT = 1920 / 1080// window.innerWidth / window.innerHeight
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
    this.#RAF()
    this.#addEventListeners()
  }

  #RAF() {
    requestAnimationFrame(x => {
      if (this.previousRAF === null) {
        this.previousRAF = x
      }

      this.#RAF()

      this.renderer.render(this.scene, this.camera)
      this.#update(x - this._previousRAF)
      this.previousRAF = x
    })
  }

  #update(time) {
    const seconds = time * 0.001
    if (this.mixers) {
      this.mixers.map(m => m.update(seconds))
    }
    if (this.player) {
      this.player.update(time) 
    }
    // this.thirdPersonCamera.update(time)
  }

  #loadAnimateModel() {
    this.player = new PlayerController(this.camera, this.scene)
    // this.thirdPersonCamera(this.camera, this.player)
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
    renderer.setSize(window.innerWidth, window.innerHeight) // Set to full screen
  
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
    // Create light
    scene.background = this.#createTexture()
    scene.add(
      this.#createPlane(),
    )
    return scene
  }

  #createTexture() {
    const loader = new THREE.CubeTextureLoader()
    const texture = loader.load([
      './img/ground/ground1.jpg',
      './img/ground/ground2.jpg',
      './img/ground/ground3.jpg',
      './img/ground/ground4.jpg',
      './img/ground/ground5.jpg',
      './img/ground/ground6.jpg'
    ])
    texture.encoding = THREE.sRGBEncoding
    return texture
  }

  #createPlane() {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 10, 10),
      new THREE.MeshStandardMaterial({
            color: 0x808080,
      }))
    plane.castShadow = false
    plane.receiveShadow = true
    plane.rotation.x = -Math.PI / 2
    return plane
  }

  #addEventListeners() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },false)
  }
}

new Main()