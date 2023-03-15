import * as THREE from 'three'

const objects = ['Tree', 'Daffy']

export class CollisonHandler {
    constructor(params) {
        this.params = params
        this.scene = params.scene
    }

    createBoundingBox(obj) {
        if (obj) {
            this.bbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
            this.bbox.setFromObject(obj)
        }
        return obj
    }

    updateBoundingBox(obj) {
        if (obj) {
            const bbox = new THREE.Box3()
            bbox.setFromObject(obj)
            this.bbox = bbox
        }
    }

    isColliding() {
        for (const obj of this.scene.children) {
            if (obj.name === objects[0] || obj.name === objects[1]) {
                const objBB = new THREE.Box3().setFromObject(obj)
                if (this.bbox.intersectsBox(objBB)) {
                    return true
                }
            }
        }
    }
}