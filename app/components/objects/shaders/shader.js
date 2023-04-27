export const glassShader = {
    uniforms: {
      uTime: { value: 0.0 },
      texture: { value: null }
    },
    fragmentShader: `
      uniform float uTime;
      uniform sampler2D texture;
      varying vec2 vUv;

      void main() {
        float alpha = 0.5 + 0.5 * sin(gl_FragCoord.x * 10.0 + uTime);
        gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
        gl_FragColor *= texture2D( texture, vUv );
      }
    `,
    vertexShader: `
    varying vec2 vUv;
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
  }
  