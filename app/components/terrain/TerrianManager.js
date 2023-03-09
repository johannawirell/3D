import * as THREE from 'three'
import { HeightMap } from './height/HeightMap'

const TEXTURE = '../../img/plane.jpg'

export class TerrainManager {
    constructor(scene, options = {}) {
        this.scene = scene

        this.options = {
          width: 500,
          height: 500,
          minHeight: 0,
          maxHeight: 100,
          segments: 128,
          wireframe: false,
          texture: TEXTURE,
          ...options,
        }
        
        this.#generateHeightMap()
        this.#generateGeometry()
        this.#initTerrain()
    }

    #generateHeightMap() {
      const { width, height, minHeight, maxHeight } = this.options
      this.heightMap = new HeightMap(width, height, minHeight, maxHeight)
    }

    #generateGeometry() {
      const { width, height, segments } = this.options
      
      this.geometry = new THREE.PlaneGeometry(width, height, segments - 1, segments - 1)
      
      this.#updateGeometyOnHeightMap()
      this.#createMesh()
    
    }

    #updateGeometyOnHeightMap() {
      const heightData = this.heightMap.heightdata
      const { segments } = this.options
      const positions = this.geometry.attributes.position
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i)
        const y = positions.getY(i)
        const height = heightData[Math.floor(y) * segments + Math.floor(x)]
        positions.setZ(i, isNaN(height) ? 0 : height)
      }
    }

    #createMesh() {
      const { texture, wireframe } = this.options

      const textureLoader = new THREE.TextureLoader()
      const textureMap = textureLoader.load(texture)

      const material = new THREE.MeshBasicMaterial({
          map: textureMap,
          wireframe,
      })

      this.mesh = new THREE.Mesh(this.geometry, material)
      this.#position()      
    }

    #position () {
      // this.mesh.rotation.x = - Math.PI / 2
    }
     

    #initTerrain() {
      this.scene.add(this.mesh)
    }

}