import './css/index.css'
import * as THREE from 'three'
import { torus } from './components/object'
import { 
  pointLight,
  ambientLight,
  lightHelper
} from './components/light'

import { 
  gridHelper
} from './components/helpers'

const FIELD_OF_VIEW = 75
const ASPECT_RATIO = window.innerWidth / window.innerHeight
const VIEW_FRUSTUM1 = 0.1
const VIEW_FRUSTUM2 = 1000
const CAMERA_POSITION_Z = 30

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  FIELD_OF_VIEW,
  ASPECT_RATIO,
  VIEW_FRUSTUM1,
  VIEW_FRUSTUM2
  )
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#background')
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight) // Set to full screen
camera.position.setZ(CAMERA_POSITION_Z) // Move camera

scene.add(
  torus,
  pointLight,
  ambientLight,
  lightHelper,
  gridHelper
)

function animate (){
  requestAnimationFrame(animate)

  torus.rotation.x += 0.001
  torus.rotation.y += 0.005
  torus.rotation.z += 0.01

  renderer.render(scene, camera)
}

animate()
