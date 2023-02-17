import * as THREE from 'three'

const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
const material = new THREE.MeshBasicMaterial({ color: 0xFF6347, wireframe: true })
export const torus = new THREE.Mesh(geometry, material)