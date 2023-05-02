import * as THREE from 'three'
import { GameEnity } from "../../controllers/gameEnity/gameEnity";

const PATH_TO_DOOR = '../../models/door.glb'

export class Door extends GameEnity {
    currentState = null
    constructor(params) {
        super(params)
        this.#loadDoor()
    }

    async #loadDoor() {
        await this.loadGLTF(PATH_TO_DOOR)
        this.target.name = 'door'
    }

    getPosition() {
        if (this.target) {
            return this.target.position
        }
    }

    open() {
        const newAction = this.states.DoorAction

        if (this.currentState !== newAction) {
            this.#updateAnimation(newAction)
        }
    }

    #updateAnimation(newAction) {
        const toPlay = this.animationsMap.get(newAction)
        toPlay.play()
        this.setState(newAction)
    }


    update(time, shouldOpen) {
        if (this.mixer) {
            this.mixer.update(time)
        }

        if (shouldOpen) {
            this.open()
        }
    }

    position(model) {
        model.scale.set(2, 2, 2)
        model.position.set(50, 0, 20)

        return this.addTranparency(model)
    } 

    addTranparency(model) {
        const materialToHide = []
        materialToHide.push(this.#getMaterial(model, 'Door_Group', 'CTRL_Hole'))

        for (const material of materialToHide) {
            this.#hide(material)
        }

        return model
    }

    #getMaterial(model, groupName, childName) {
        const group = model.children.find(obj => obj.name === groupName)
        const child = group.children.find(obj => obj.name === childName)
        return child.material
    }

    #hide(material) {
        material.transparent = true
        material.opacity = 0
    }


}