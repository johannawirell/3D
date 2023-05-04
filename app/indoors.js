
import { ComputerDescription } from './components/html/computerDescription'

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
          if (!this.addedSpheres) {
               this.#addObstaclesToPlayer()
          }
          this.plane.update(time)
          this.playerPosition = this.player.getPosition()
          // if (!this.doorPosition) {
          //      this.doorPosition = this.plane.getDoorPosition()
          // } 

          if (!this.computerPosition) {
               this.computerPosition = await this.plane.getComputerPosition()
          } else if (!this.playComputer){
               if (this.#shouldShowComputer()) {
                    if (!this.computerDescription) {
                         this.computerDescription = new ComputerDescription({
                              scene: this.scene,
                              width: window.innerWidth,
                              height: window.innerHeight,
                              player: this.player
                            })
                    } else {
                         this.computerDescription.show()
                    }
                   
                       this.playComputer = true
               } 
          } else if (this.playComputer && !this.#shouldShowComputer()) {
               this.playComputer = false
               this.computerDescription.hide()
          }

          if (this.computerDescription) {
               this.computerDescription.update(this.camera)
          }
     }
     
     #shouldShowComputer() {
          return this.playerPosition.distanceTo(this.computerPosition) <= 15
     }

     shouldMoveOutdoors() {

     }

     moveOutdoors() {}

     #addObstaclesToPlayer() {
          const obstacleSpheres = this.plane.getSpheres()
          if (obstacleSpheres) {
              this.player.addObstacleSpheres(obstacleSpheres)
              this.addedSpheres = true
          }
     }
}