precision highp float;

uniform vec2 resolution;
uniform bool vflip;
uniform sampler2D texture;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  if ( vflip ) { uv.y = 1.0 - uv.y; }
  gl_FragColor = texture2D( texture, uv );
}
