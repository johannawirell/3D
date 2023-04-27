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
      vec4 color = vec4(0.8, 0.8, 0.9, alpha);
      gl_FragColor = color * texture2D(texture, vUv);
    }
  `,
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
}
