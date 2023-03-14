
import * as THREE from 'three'


export const entity = (() => {
  class Entity {
    constructor() {
      this.name = null
      this.components = {}

      this.position = new THREE.Vector3()
      this.rotation = new THREE.Quaternion()
      this.handlers = {}
      this.parent = null
    }

    registerHandler(n, h) {
      if (!(n in this.handlers)) {
        this.handlers[n] = []
      }
      this.handlers[n].push(h)
    }

    setParent(p) {
      this.parent = p
    }

    setName(n) {
      this.name = n
    }

    get Name() {
      return this.name
    }

    setActive(b) {
      this.parent.SetActive(this, b)
    }

    addComponent(c) {
      c.setParent(this)
      this.components[c.constructor.name] = c

      c.initComponent()
    }

    getComponent(n) {
      return this.components[n]
    }

    findEntity(n) {
      return this.parent.get(n)
    }

    broadcast(msg) {
      if (!(msg.topic in this.handlers)) {
        return
      }

      for (let curHandler of this.handlers[msg.topic]) {
        curHandler(msg)
      }
    }

    setPosition(p) {
      this.position.copy(p)
      this.broadcast({
          topic: 'update.position',
          value: this.position,
      })
    }

    setQuaternion(r) {
      this.rotation.copy(r)
      this.broadcast({
          topic: 'update.rotation',
          value: this.rotation,
      })
    }

    update(timeElapsed) {
      for (let k in this.components) {
        this.components[k].update(timeElapsed)
      }
    }
  }

  class Component {
    constructor() {
      this.parent = null
    }

    setParent(p) {
      this.parent = p
    }

    initComponent() {}

    getComponent(n) {
      return this.parent.getComponent(n)
    }

    findEntity(n) {
      return this.parent.findEntity(n)
    }

    broadcast(m) {
      this.parent.broadcast(m)
    }

    update() {}

    registerHandler(n, h) {
      this.parent.registerHandler(n, h)
    }
  }

  return {
    Entity: Entity,
    Component: Component,
  }

})()