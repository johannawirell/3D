import * as THREE from 'three'

export class GrassField {
    constructor(params) {
        this.loadingManager = params.loadingManager
        this.scene = params.scene
        this.field = this.#createField()
    }

    #createField() {
        const grassColor = 0x7cfc00; // Grön färg för gräset

        const grassWidth = window.innerWidth; // Bredd på spelplanen
        const grassHeight = window.innerHeight; // Höjd på spelplanen
        
        const grassGeometry = new THREE.BufferGeometry(); // Skapa geometri för gräset
        const grassPositions = [];
        
        // Loop för att skapa och placera ut linjer på plan yta
        for (let x = -grassWidth / 2; x <= grassWidth / 2; x += 0.5) {
          for (let z = -grassHeight / 2; z <= grassHeight / 2; z += 0.5) {
            const startPosition = new THREE.Vector3(x, 0, z);
            const endPosition = new THREE.Vector3(x, 5, z);
        
            grassPositions.push(startPosition.x, startPosition.y, startPosition.z);
            grassPositions.push(endPosition.x, endPosition.y, endPosition.z);
          }
        }
        
        grassGeometry.setAttribute('position', new THREE.Float32BufferAttribute(grassPositions, 3));
        const grassMaterial = new THREE.LineBasicMaterial({ color: grassColor });
        const grass = new THREE.LineSegments(grassGeometry, grassMaterial);
        
        this.scene.add(grass); // Lägg till gräset i scenen
        
    }

    position(model) {
        model.scale.set(2, 2, 2)
        return model
    } 
}