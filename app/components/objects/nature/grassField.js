import * as THREE from 'three'

export class GrassField {
    constructor(params) {
        this.loadingManager = params.loadingManager
        this.scene = params.scene
        this.field = this.#createField()
    }

    #createField() {
        // Skapa en kon geometri
        var geometry = new THREE.ConeGeometry( 1, 2, 32 );

        // Skapa en grön material
        var material = new THREE.MeshBasicMaterial( { color: 112711 } );

        // Skapa en mesh av kon geometrin och materialet
        var cone = new THREE.Mesh( geometry, material );
        this.scene.add( cone );
        // this.loadGLTF(grass.path)
    }

  
}