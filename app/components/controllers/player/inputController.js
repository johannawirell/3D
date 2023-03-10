export class InputController {
    constructor() {
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false,
            shift: false
        }
        this.#addEventListeners()
    }

    #addEventListeners() {
        document.addEventListener('keydown', e => this.#handleKeyDown(e), false)
        document.addEventListener('keyup', e => this.#handleKeyUp(e), false)
    }

    #handleKeyDown(event) {
        switch (event.keyCode) {
            case 87: // w
                this.keys.forward = true
                break
            case 65: // a
                this.keys.left = true
                break
            case 83: // s
                this.keys.backward = true
                break
            case 68: // d
                this.keys.right = true
                break
            case 32: // SPACE
                this.keys.space = true
                break
            case 16: // SHIFT
                this.keys.shift = true
                break
        }
    }

    #handleKeyUp(event) {
        switch(event.keyCode) {
            case 87: // w
                this.keys.forward = false
                break
            case 65: // a
                this.keys.left = false
                break
            case 83: // s
                this.keys.backward = false
                break
            case 68: // d
                this.keys.right = false
                break
            case 32: // SPACE
                this.keys.space = false
                break
            case 16: // SHIFT
              this.keys.shift = false
              break
        }
    }

    isDirectionsPressed() {
        if (this.keys.forward || this.keys.backward 
            || this.keys.right || this.keys.left) {
            return true
        } else {
            return false
        }
    }

    isShiftPressed() {
        if (this.keys.shift) {
            return true
        } else {
            return false
        }
    }

    getActiveKeys() {
        const activeKeys = [...Object.keys(this.keys)]
            .filter(key => this.keys[key])
        return activeKeys
    }
}