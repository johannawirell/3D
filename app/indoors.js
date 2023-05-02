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


     async update(time) {
          this.playerPosition = this.player.getPosition()
          // if (!this.doorPosition) {
          //      this.doorPosition = this.plane.getDoorPosition()
          // } 

          if (!this.computerPosition) {
               this.computerPosition = await this.plane.getComputerPosition()
          }

     }



     #updateDoor() {
          if (!this.doorPosition) {
               this.doorPosition = this.plane.getDoorPosition()
          } else {
               const playerPosition = this.player.getPosition()
               const distance = playerPosition.distanceTo(this.doorPosition)
               // console.log(distance)
               if (distance <= 61 && distance > 55) {
                    this.shouldOpen = true
               } else {
                    this.shouldOpen = false
               }
          }
          this.plane.update(time, this.shouldOpen)
     }

     shouldMoveOutdoors() {

     }

     moveOutdoors() {}
}