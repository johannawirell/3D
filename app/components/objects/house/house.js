import * as THREE from 'three'
import { GameEnity } from '../../controllers/gameEnity/gameEnity'
import { glassShader } from '../shaders/shader'

const PATH_TO_HOUSE= '../../../models/house.glb'

export class House extends GameEnity {

    constructor(params) {
        super(params)
        this.loadingManager = params.loadingManager
        this.entityManager = params.entityManager
        
        this.#loadHouse()
    }

    async #loadHouse() {
        await this.loadGLTF(PATH_TO_HOUSE)
        const doorAction = this.animationsMap.get('DoorAction')
        doorAction.play()

        this.target.traverse((child) => {
            if (child.name.includes('Window')) {
                child.material = new THREE.ShaderMaterial(glassShader)
            }
        })
    }

    addTransparency(model) {
        const materialToHide = []
        materialToHide.push(this.#getMaterial(model, 'Door_Group', 'CTRL_Hole'))

        for (const material of materialToHide) {
            this.#hide(material)
        }
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

    createBoundingSphereHouse(model) {
        model.traverse(obj => {
            if (this.#shouldCreateSphere(obj)) {
                const obstacle = this.createObstacle(obj)

                console.log(obj)

            }
        })
    }

    #shouldCreateSphere(obj) {
        return (
            obj.type === 'Group' && 
            (!obj.name.includes('Door')) &&
            (!obj.name.includes('Hole')) &&
            (!obj.name.includes('floor')) &&
            (!obj.name.includes('Scene'))
        )
    }

    getSphere() {
        return this.sphere
    }

   position(model) {
        if (model) {
            model.rotation.set(0, 0, Math.PI, 1)
            model.position.y = 1.1
            // model.position.set(-20, 1.1, -0)
        }
        return model
    }

    update(time) {
        if (this.mixer) {
            this.mixer.update(time)
        }
    }
}
