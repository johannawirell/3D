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
    }

    getComputerPosition() {
        return this.plane.getComputerPosition()
    }

    get position () {
        return this.plane.position()
    }

    getObstacles() {
        return this.plane.getObstacles()
    }

    getSpheres() {
        return this.plane.getSpheres()
    }
}

