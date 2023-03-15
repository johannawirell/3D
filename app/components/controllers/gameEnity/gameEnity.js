import * as YUKA from 'yuka'

export class GameEnity {
    constructor(params) {
        this.scene = params.scene
    }

    createObstacle() {
        if (this.target) {
            // this.obstacle = new YUKA.GameEntity()
            // this.obstacle.position.copy(this.target.position)
            // this.obstacle.boundingBox = obstacleGeometry.boundingSphere.radius
            // this.entityManager.add(this.obstacle)
        }
    }
}