import * as THREE from 'three'

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

    getCollidingObject(objectNames) {
        for (const obj of this.scene.children) {            
            if (objectNames.includes(obj.name)) {
                const objBB = new THREE.Box3().setFromObject(obj)
                if (this.bbox.intersectsBox(objBB)) {
                    return obj
                }
            }
        }
        return false
    }
}