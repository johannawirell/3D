export class Indoors {
     constructor(params) {
          this.scene = params.scene
          this.camera = params.camera
          this.plane = params.plane
          this.player = params.player
          this.loading = params.loading
          this.entityManager = params.entityManager
     }

     update(time) {

     }

     shouldMoveOutdoors() {}

     moveOutdoors() {}
}