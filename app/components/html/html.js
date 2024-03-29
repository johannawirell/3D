import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

export class HTMLElement {
    constructor(params) {
        this.params = params
        this.scene = params.scene
        
        this.#createRenderer()
        this.#createDiv()
    }

    #createRenderer() {
        const { width, height } = this.params
        this.CSS2DRenderer = new CSS2DRenderer()
        this.CSS2DRenderer.setSize(width, height)
        document.body.appendChild(this.CSS2DRenderer.domElement)
    }

    #createDiv() {
        this.div = document.createElement('div')

        this.addContent()

        const object = new CSS2DObject(this.div)
        this.div.autofocus = true
        this.scene.add(object)
    }

    update(camera) {
        this.CSS2DRenderer.render(this.scene, camera)
    }
}