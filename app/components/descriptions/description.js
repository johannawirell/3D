import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';

export class Description {
    constructor(params) {
        this.params = params
        this.scene = params.scene
        
        this.#createRenderer()
    }

    #createRenderer() {
        const { width, height } = this.params
        console.log( width, height )
        this.CSS3DRenderer = new CSS3DRenderer()
    }
}