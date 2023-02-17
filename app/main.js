import './css/index.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PlayerController } from './components/controllers/playerController'
import { tindra } from './components/objects/tindra'
import { plane } from './components/objects/plane'
import { 
  pointLight,
  ambientLight
} from './components/light'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
const PATH_TO_MODEL = './models/Soldier.glb'

const FIELD_OF_VIEW = 10
const ASPECT_RATIO = window.innerWidth / window.innerHeight
const VIEW_FRUSTUM1 = 0.1
const VIEW_FRUSTUM2 = 1000
const CAMERA_POSITION_Z = 50
const CAMERA_POSITION_Y = 5
const CAMERA_POSITION_X = 5
const MIN_DISTANSE = 5
const MAX_DISTANCE = 150
const POLAR_ANGLE = Math.PI / 2 - 0.05

const main = () => {
  try {
    const animate = () => {
      requestAnimationFrame(animate)
    
      controls.update()
    
      renderer.render(scene, camera)
    }

    const playerController = new PlayerController()
    const camera = createCamera()
    let scene = createScene()
    const renderer = createRenderer()
    const controls = createControls(camera, renderer)

    animate()
  } catch (err) {
    console.log(err)
  }
}

function createScene() {
  const scene = new THREE.Scene()
   

    new GLTFLoader()
      .load(PATH_TO_MODEL, gltf => {
          const model = gltf.scene
          model.traverse(obj => {
              if (obj.isMesh) {
                  obj.castShadow = true
              }
          })
          scene.add(
            pointLight,
            ambientLight,
            plane,
            model
            // tindra
          )
  })
    createPlayer()
  return scene
}

function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    FIELD_OF_VIEW,
    ASPECT_RATIO,
    VIEW_FRUSTUM1,
    VIEW_FRUSTUM2
  )
  camera.position.setZ(CAMERA_POSITION_Z)
  camera.position.setY(CAMERA_POSITION_Y)
  camera.position.setX(CAMERA_POSITION_X)

  return camera
}

function createRenderer() {
  const renderer = new THREE.WebGL1Renderer({
    canvas: document.querySelector('#background'),
    // antialias: true BEHÖVS?
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight) // Set to full screen

  return renderer
}

function createControls(camera, renderer) {
  const controls = new OrbitControls(
    camera,
    renderer.domElement
  )
  controls.enableDamping = true
  controls.minDistance = MIN_DISTANSE
  controls.maxDistance = MAX_DISTANCE 
  controls.enablePan = true
  controls.maxPolarAngle = POLAR_ANGLE

  return controls
}

function createPlayer() {
  
}

main()
