import * as THREE from 'three'

const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 })
export const torus = new THREE.Mesh(geometry, material)