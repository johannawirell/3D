export const glassShader = {

    uniforms: {
        uTime: { value: 0.0 },
    },
    fragmentShader: `
        uniform float uTime;
        
        void main() { 
            float alpha = 0.5 + 0.5 * sin(gl_FragCoord.x * 10.0 + uTime);
            gl_FragColor = vec4(1.0, 1.0, 1.0, alpha); 
        } 
    `,
    vertexShader: `
    void main() { 
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    } 
    `,
}
