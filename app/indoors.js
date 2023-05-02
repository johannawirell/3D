import * as THREE from 'three'
export class Indoors {
     constructor(params) {
          this.scene = params.scene
          this.camera = params.camera
          this.plane = params.plane
          this.player = params.player
          this.loading = params.loading
          this.entityManager = params.entityManager

          this.#createLight()
     }

     #createLight() {
          const height = window.innerHeight / 4
          const light = new THREE.PointLight(0xffffff, 1, 100)
          light.position.set(0, height, 0)
          light.castShadow = true
          light.shadow.mapSize.width = 2048
          light.shadow.mapSize.height = 2048
          this.scene.add(light)
     }

     update(time) {

     }

     shouldMoveOutdoors() {}

     moveOutdoors() {}
}