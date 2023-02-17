export class PlayerController {
    constructor() {
        this.pressedKeys = {}
        this.addEventListeners()
    }

    addEventListeners() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this))
        document.addEventListener('keyup', this.handleKeyUp.bind(this))
    }

    handleKeyDown(event) {
        this.pressedKeys[event.key.toLowerCase()] = true;
        console.log(this.model);
    }
    
    handleKeyUp(event) {
        this.pressedKeys[event.key.toLowerCase()] = false;
    }
}


