import * as THREE from 'three'

export class CollisonHandler {
    constructor(params) {
        this.params = params
    }

    createBoundingBox(obj, scale) {
        if (obj) {
            this.bbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
            this.bbox.setFromObject(obj)
            this.bbox.expandByVector(scale)
        }
        return obj
    }

    updateBoundingBox(obj, scale) {
        if (obj) {
            const bbox = new THREE.Box3()
            bbox.setFromObject(obj)
            bbox.expandByVector(scale)
            this.bbox = bbox
        }
    }
}