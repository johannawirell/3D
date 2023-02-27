import './css/index.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PlayerController } from './components/controllers/playerController'
import { HorseController } from './components/controllers/horseController'
import { plane } from './components/objects/plane'
import { 
  pointLight,
  ambientLight
} from './components/light'

const FIELD_OF_VIEW = 10
const ASPECT_RATIO = window.innerWidth / window.innerHeight
const VIEW_FRUSTUM1 = 0.1
const VIEW_FRUSTUM2 = 1000
const CAMERA_POSITION_Z = 500
const CAMERA_POSITION_Y = 50
const CAMERA_POSITION_X = 50
const MIN_DISTANSE = 5
const MAX_DISTANCE = 300
const POLAR_ANGLE = Math.PI / 2 - 0.05
const PATH_TO_SKY = './img/sky.jpg'

const main = () => {
  try {
    const camera = createCamera()
    const scene = createScene()
    const renderer = createRenderer()
    const controls = createControls(camera, renderer)
    
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }

    animate()
  } catch (err) {
    console.log(err)
  }
}

function createScene() {
  const playerController = new PlayerController()
  const horseController = new HorseController()
  let scene = new THREE.Scene()

  scene.add(
    pointLight,
    ambientLight,
    plane
  )

  scene = playerController.addPlayerTo(scene)
  scene = horseController.addHorseTo(scene)
  scene = addSky(scene)
  return scene
}

function addSky(scene) {
  const loader = new THREE.TextureLoader()
  const texture = loader.load(PATH_TO_SKY)
  scene.background = texture

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
    antialias: true 
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

main()
