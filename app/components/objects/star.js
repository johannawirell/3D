import * as THREE from 'three'

const RADIUS = 0.25
const WIDTH = 24
const HEIGHT = 24
const WHITE = 0xffffff
const POSITION = 100

export const createStar = () => {
    const geometry = new THREE.SphereGeometry(
        RADIUS,
        WIDTH,
        HEIGHT
    )
    const material = new THREE.MeshStandardMaterial({ color: WHITE })
    const star = new THREE.Mesh(geometry, material)
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(POSITION))
    star.position.set(x, y, z)
    return star
}



