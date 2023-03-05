import './css/index.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { PlayerController } from './components/controllers/playerController'
// import { HorseController } from './components/controllers/horseController'
import { plane } from './components/objects/plane'
import { 
  pointLight,
  ambientLight
} from './components/light'

const FIELD_OF_VIEW = 10
const ASPECT_RATIO = window.innerWidth / window.innerHeight
const VIEW_FRUSTUM1 = 0.1
const VIEW_FRUSTUM2 = 1000
const CAMERA_POSITION_Z = 200
const CAMERA_POSITION_Y = 20
const CAMERA_POSITION_X = 20
const MIN_DISTANSE = 5
const MAX_DISTANCE = 700
const POLAR_ANGLE = Math.PI / 2 - 0.05
const PATH_TO_SKY = './img/sky.jpg'
const PATH_TO_PLAYER = './models/Soldier.glb'
const PATH_TO_HORSE = './models/daffy(2).glb'

// Public variables
let clock, camera, scene, renderer, controls, player, horse

const main = () => {
  try {
    clock = new THREE.Clock()
    camera = createCamera()
    scene = createScene()
    renderer = createRenderer()
    controls = createControls(camera, renderer)

    createPlayer()
    createHorse()
    // const horseController = new HorseController()
   
    // scene = horseController.addHorseTo(scene)
    
    const animate = () => {
      let mixerUpdateDelta = clock.getDelta()

      if (player) {
        player.update(mixerUpdateDelta)
      }
      controls.update()
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  } catch (err) {
    console.log(err)
  }
}

function createScene() {
  let scene = new THREE.Scene()

  scene.add(
    pointLight,
    ambientLight,
    plane
  )
  
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

function createPlayer() {
  new GLTFLoader().load(PATH_TO_PLAYER, gltf => {
    const model = gltf.scene
    model.scale.set(5, 5, 5)
    model.traverse(obj => {
        if (obj.isMesh) obj.castShadow = true
    })
    scene.add(model)

    const gltfAnimations = gltf.animations
    const mixer = new THREE.AnimationMixer(model)
    const animationsMap = new Map()
    gltfAnimations.filter(a => a.name != 'TPose').forEach(a => {
        animationsMap.set(a.name, mixer.clipAction(a))
    })

   player =  new PlayerController(model, mixer, animationsMap, controls, camera,  'Idle')
  })
}

function createHorse() {
  new GLTFLoader().load(PATH_TO_HORSE, gltf => {
      const model = gltf.scene
      model.traverse(obj => {
        if (obj.isMesh) obj.castShadow = true
      })
     scene.add(model)

      // const mixer = new AnimationMixer(model)

      // gltf.animations.forEach(animation => {
      //     mixer.clipAction(animation).play()
      // })
      // model.traverse(obj => {
      //     if (obj.isMesh) {
      //         obj.castShadow = true
      //         obj.material.emissiveIntensity = 1.0
      //     }
      // })

      // const light = new SpotLight(0xffffff, 10);
      // light.position.set(100, 100, 100)
      // light.target = model

      // this.mixer = new AnimationMixer(model) 
      // this.mixer.clipAction(gltf.animations[0]).play()
    

      // const update = () => {
      //     requestAnimationFrame(update)
      //     mixer.update(0.0167)
      // }
      // update()
  })
return scene
}

main()
