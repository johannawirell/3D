const X_POSITION = 100
const Y_POSITION = 0
const Z_POSITION = -100

export class HorseController {
    constructor(model, mixer, camera) {
        this.model = model
        this.mixer = mixer
        this.camera = camera

        this.#position()
    }

    #position() {
        this.model.position.set(X_POSITION, Y_POSITION, Z_POSITION)
        this.model.rotateY(Math.PI)
    }

    update() {
        // requestAnimationFrame(update)
        // this.mixer.update(0.0167)
    }

}
