import { OutdoorPlane } from './outdoorPlane'
import { IndoorPlane } from './indoorPlane'

export class Plane {
    radius = 100
    constructor(params) {
        this.scene = params.scene
        this.loadingManager = params.loadingManager
        this.entityManager = params.entityManager
    }

    createOutdoorPlane() {
        this.plane = new OutdoorPlane({
            scene: this.scene,
            loadingManager: this.loadingManager,
            entityManager: this.entityManager
        })
    }

    createIndoorPlane() {
        this.plane = new IndoorPlane({
            scene: this.scene,
            loadingManager: this.loadingManager,
            entityManager: this.entityManager
        })

        this.door = this.plane.getDoor()
    }

    get position () {
        return this.plane.position()
    }

    update(time) {
        if (this.door) {
            this.door.update(time)
        }

        // if (this.mixer) {
        //     console.log('eh')
        //     this.mixer.update(time)
        // }
        
    }

    getObstacles() {
        return this.plane.getObstacles()
    }

    getSpheres() {
        return this.plane.getSpheres()
    }
}

