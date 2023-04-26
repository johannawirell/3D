export const glassShader = {

    uniforms: {
        uTime: { value: 0.0 },
    },
    fragmentShader: `
        uniform float uTime;
        void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
            if (mod(gl_FragCoord.x + gl_FragCoord.y + uTime * 10.0, 20.0) < 10.0) {
                gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
            }
        }
    `,
    vertexShader: `
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
}
