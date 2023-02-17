import './css/index.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { tindra } from './components/objects/tindra'
import { plane } from './components/objects/plane'
import { 
  pointLight,
  ambientLight
} from './components/light'

const FIELD_OF_VIEW = 75
const ASPECT_RATIO = window.innerWidth / window.innerHeight
const VIEW_FRUSTUM1 = 0.1
const VIEW_FRUSTUM2 = 1000
const CAMERA_POSITION_Z = 50
const CAMERA_POSITION_Y = 10

const main = () => {
  try {
    const animate = () => {
      requestAnimationFrame(animate)
    
      controls.update()
    
      renderer.render(scene, camera)
    }

    const moveCamera = () => {
      camera.position.setZ(CAMERA_POSITION_Z)
      camera.position.setY(CAMERA_POSITION_Y)
    }

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

    const controls = new OrbitControls(
      camera,
      renderer.domElement
    )

    scene.add(
      pointLight,
      ambientLight,
      plane,
      tindra
    )

    animate()
    moveCamera()
  } catch (err) {
    console.log(err)
  }
}

main()
