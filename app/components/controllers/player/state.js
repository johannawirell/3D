export class State {
    constructor() {
       this.states = {
            walk: 'Walk',
            run: 'Run',
            idle: 'Idle'
        }
        this.currentState = this.states.idle
    }
    
      update(input, isDirectionsPressed) {
        if (isDirectionsPressed) {
            if (input.shift) {
                this.currentState = this.states.run
            } else {
                this.currentState = this.states.walk
            }
        } else {
            this.currentState = this.states.idle
        }
        return this.currentState
      }

    get current () {
        return this.currentState
    }

}