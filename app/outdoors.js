import { DogController } from './components/controllers/dog/dogController'
import { HorseController } from './components/controllers/horse/horseController'

export class Outdoors {
    constructor(params) {
        this.scene = params.scene
        this.camera = params.camera
        this.plane = params.plane
        this.player = params.player
        this.entityManager = params.entityManager

        this.loadAnimateModel()
    }

    loadAnimateModel() {
        this.horse = new HorseController({
            camera: this.camera, 
            scene: this.scene,
            entityManager: this.entityManager
          })
          this.dog = new DogController({
            camera: this.camera,
            scene: this.scene,
            entityManager: this.entityManager
          })
    }

    update(time) {
        if (!this.obstacles) {
            this.#addObstaclesToHorse()
           }
        if (!this.addedSpheres) {
            this.#addObstaclesToPlayer()
        }

        const seconds = time * 0.001
               
    
        if (this.horse) {
          this.horse.update(seconds)
        }
    
        if (this.dog) {
          this.dog.update(seconds)
        }
    
        const playerPosition = this.player.getPosition()
        const horsePosition = this.horse.getPosition()
        if (playerPosition.distanceTo(horsePosition) < 50) {
          if (!this.isNearHorse) {
            console.log('is near horse')
          }
    
          this.isNearHorse = true
    
        } else if (this.isNearHorse) {
          this.isNearHorse = false
        }
    }

    #addObstaclesToHorse() {
        this.obstacles = this.plane.getObstacles()
        this.horse.addObstacles(this.obstacles)
      }
    
    #addObstaclesToPlayer() {
    const obstacleSpheres = this.plane.getSpheres()
    this.horseSphere = this.horse.getSphere()
    this.dogSphere = this.dog.getSphere()
    if (this.horseSphere && this.dogSphere) {
    obstacleSpheres.push(this.horseSphere, this.dogSphere)
    this.player.addObstacleSpheres(obstacleSpheres)
    this.addedSpheres = true
    
    }
    }   
}