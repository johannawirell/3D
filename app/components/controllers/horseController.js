const WIDTH = 0.4
const HEIGHT = 0.4
const DEPTH = 0.4

const X_POSITION = 100
const Y_POSITION = 0
const Z_POSITION = -100

export class HorseController {
    constructor(model) {
        this.model = model
        this.position()
        this.pressedKeys = {}
        this.addEventListeners()
    }

    addEventListeners() {

    }

    update() {}

    position() {
        this.model.scale.set(WIDTH, HEIGHT, DEPTH)
        this.model.position.set(X_POSITION, Y_POSITION, Z_POSITION)
        this.model.rotateY(Math.PI)
    }
}
