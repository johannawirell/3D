import * as THREE from 'three'
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
          if (!this.doorPosition) {
               this.doorPosition = this.plane.getDoorPosition()
          } else {
               const playerPosition = this.player.getPosition()
               const distance = playerPosition.distanceTo(this.doorPosition)
               // if (distance !== 0)
                    // console.log(distance)
               if (distance <= 61 && distance > 58) {
                    console.log('open')
                    this.plane.update(time)
             }
          }
          
     }

     shouldMoveOutdoors() {

     }

     moveOutdoors() {}
}