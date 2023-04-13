export const vertexShader = `
  uniform float time;
  uniform float windStrength;
  attribute vec3 offset;
  attribute vec3 customColor;
  varying vec3 vColor;

  void main() {
    vColor = customColor;
    vec4 mvPosition = modelViewMatrix * vec4(position + offset, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_Position.y += sin(time * 10.0 + mvPosition.x * 0.5) * windStrength;
  }
`

export const fragmentShader = `
  uniform sampler2D alphaMap;
  varying vec3 vColor;

  void main() {
    vec4 color = texture2D(alphaMap, gl_PointCoord);
    if (color.a < 0.5) discard;
    gl_FragColor = vec4(vColor, 1.0);
  }
`
