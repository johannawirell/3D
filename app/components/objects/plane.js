import * as THREE from 'three'

const IMAGE = '../../img/plane.jpg'

export class Plane {
    constructor(scene) {
        this.scene = scene
        this.#createPlane()
    }

    get position () {
        return {
            x: this.plane.geometry.parameters.width / 4,
            z: this.plane.geometry.parameters.height / 4
        }
    }

    #createTexture() {
       const texture = new THREE.TextureLoader().load(IMAGE)
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping 
        texture.repeat.set(40, 20)
        return texture
    }

    #createPlane() {
        const texture = this.#createTexture()
        this.plane = new THREE.Mesh(
            new THREE.PlaneGeometry(
                window.innerWidth * 2,
                window.innerHeight * 2,
            ),
            new THREE.MeshBasicMaterial( { map: texture })
        )

        this.#position()
        this.scene.add(this.plane)        
    }

    #position() {
        this.plane.rotation.x = - Math.PI / 2
        this.plane.position.set(0, 0, 0)

    }
}

