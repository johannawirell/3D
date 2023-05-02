import * as THREE from 'three'
import { OutdoorPlane } from './outdoorPlane'
import { Forrest } from '../nature/forrest'

const SKYBOX = [
    '../../img/skybox/posx.jpg',
    '../../img/skybox/negx.jpg',
    '../../img/skybox/posy.jpg',
    '../../img/skybox/negy.jpg',
    '../../img/skybox/posz.jpg',
    '../../img/skybox/negz.jpg',  
]

const GRASS = {
    ao: '../../img/grass/grass-ao.png',
    heightmap: '../../img/grass/grass-heightmap.png',
    normalmap: '../../img/grass/grass-normalmap.png',
    roughness: '../../img/grass/grass-roughness.png',
    texture: '../../img/grass/grass-texture.png',

}

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
        // this.plane = new IndoorPlane({
        //     scene: this.scene,
        //     loadingManager: this.loadingManager,
        //     entityManager: this.entityManager
        // })
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

