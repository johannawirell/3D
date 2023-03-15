import * as YUKA from 'yuka'
import * as THREE from 'three'

export class GameEnity {
    constructor(params) {
        this.scene = params.scene
    }

    createObstacle(object) {
        if (this.target) {
            // console.log(this.target)
            // this.obstacle = new YUKA.GameEntity()
            // this.obstacle.position.copy(this.target.position)
            // this.obstacle.boundingBox = obstacleGeometry.boundingSphere.radius
            // this.entityManager.add(this.obstacle)
        }
    }

    getBoundingSphereForGLTF(gltfObject) {
        const box = new THREE.Box3().setFromObject(gltfObject)
        const sphere = new THREE.Sphere()
        box.getBoundingSphere(sphere)

        return box
    }
}