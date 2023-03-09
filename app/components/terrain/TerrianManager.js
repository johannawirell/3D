import * as THREE from 'three'
import { GUI } from 'dat.gui'
import { TerrainChunk } from './TerrainChunk'

export class TerrainManager {
    chunkSize = 500
    constructor(scene) {
        this.scene = scene
        
        this.#createGUI()
        this.#initTerrain()
    }

    #createGUI() {
        this.guiParams = {
            general: {
            },
          }
          this.gui = new GUI()
      
          const generalRollup = this.gui.addFolder('General')
          this.gui.close()
    }

    #initTerrain() {
        this.guiParams.terrain = {
            wireframe: false
        }

        this.group = new THREE.Group()
        this.group.rotation.x = - Math.PI / 2
        this.scene.add(this.group)

        const terrainRollup = this.gui.addFolder('Terrain')
        terrainRollup.add(this.guiParams.terrain, "wireframe")
            .onChange(() => {
                for (let i in this.chunks) {
                    this.chunks[i].chunk.plane.material.wireframe = this.guiParams.terrain.wireframe
                }
            });
    
        this.chunks = {}
        for (let x = -1; x <= 1; x++) {
            for (let z = -1; z <= 1; z++) {
              this.#addChunk(x, z)
            }
          }
    }

    #addChunk(x, z) {
        const offset = new THREE.Vector2(x * this.chunkSize, z * this.chunkSize)
        const chunk = new TerrainChunk({
          group: this.group,
          offset: new THREE.Vector3(offset.x, offset.y, 0),
          scale: 1,
          width: this.chunkSize
        //   heightGenerators: [new HeightGenerator(this._noise, offset, 100000, 100000 + 1)],
        });
    
        const k = this.#key(x, z)
        const edges = [];
        for (let xi = -1; xi <= 1; xi++) {
          for (let zi = -1; zi <= 1; zi++) {
            if (xi == 0 || zi == 0) {
              continue
            }
            edges.push(this.#key(x + xi, z + zi));
          }
        }
    
        this.chunks[k] = {
          chunk: chunk,
          edges: edges
        };
    }

    #key(x, z) {
        return x + '.' + z
    }
}