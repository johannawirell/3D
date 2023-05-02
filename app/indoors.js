import * as THREE from 'three'
export class Indoors {
     playComputer = false
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
          } else if (!this.playComputer){
               if (this.#shouldShowComputer()) {
                    console.log('play computer')
                    this.playComputer = true
               } 
          } else if (this.playComputer && !this.#shouldShowComputer()) {
               this.playComputer = false
          }
     }
     
     #shouldShowComputer() {
          return this.playerPosition.distanceTo(this.computerPosition) <= 11
     }

     shouldMoveOutdoors() {

     }

     moveOutdoors() {}
}