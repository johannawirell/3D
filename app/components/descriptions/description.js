import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';

export class Description {
    constructor(params) {
        this.params = params
        this.scene = params.scene
        
        this.#createRenderer()
        this.#createDiv()
    }

    #createRenderer() {
        const { width, height } = this.params
        this.CSS3DRenderer = new CSS3DRenderer()
        this.CSS3DRenderer.setSize(width, height)
        document.body.appendChild(this.CSS3DRenderer.domElement)
    }

    #createDiv() {
        this.div = document.createElement('div')
        this.div.style.width = '100px';
        this.div.style.height = '100px';
        this.div.style.backgroundColor = 'red';

        const object = new CSS3DObject(this.div)
        object.position.set(0, 0, 0)
        this.scene.add(object)
    }

    update(camera) {
        this.CSS3DRenderer.render(this.scene, camera)
    }
}