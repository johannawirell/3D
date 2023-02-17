import './css/index.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { tindra } from './components/objects/tindra'
import { plane } from './components/objects/plane'
import { 
  pointLight,
  ambientLight
} from './components/light'

const FIELD_OF_VIEW = 50
const ASPECT_RATIO = window.innerWidth / window.innerHeight
const VIEW_FRUSTUM1 = 0.1
const VIEW_FRUSTUM2 = 1000
const CAMERA_POSITION_Z = 50
const CAMERA_POSITION_Y = 10
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
    const scene = createScene()
    const camera = createCamera()
    const renderer = createRenderer()
    const controls = createControls(camera, renderer)

    animate()
  } catch (err) {
    console.log(err)
  }
}

function createScene() {
  const scene = new THREE.Scene()
    scene.add(
      pointLight,
      ambientLight,
      plane,
      tindra
    )
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

main()
