#define lofi(i,j) floor((i)/(j)+.5)*(j)
#define PI 3.14159265

precision highp float;

uniform vec2 resolution;

uniform bool isVert;
uniform int blockSize;
uniform sampler2D sampler0;

// ------

vec3 yuv2rgb( vec3 yuv ) {
  return vec3(
    yuv.x + 1.402 * yuv.z,
    yuv.x - 0.344136 * yuv.y - 0.714136 * yuv.z,
    yuv.x + 1.772 * yuv.y
  );
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 bv = ( isVert ? vec2( 0.0, 1.0 ) : vec2( 1.0, 0.0 ) );
  vec2 block = bv * float( blockSize - 1 ) + vec2( 1.0 );
  vec2 blockOrigin = 0.5 + floor( gl_FragCoord.xy / block ) * block;

  float delta = mod( isVert ? gl_FragCoord.y : gl_FragCoord.x, float( blockSize ) );
  
  vec3 sum = vec3( 0.0 );
  for ( int i = 0; i < 1024; i ++ ) {
    if ( blockSize <= i ) { break; }

    float fdelta = float( i );

    vec4 tex = texture2D( sampler0, ( blockOrigin + bv * fdelta ) / resolution );
    vec3 val = tex.xyz;

    float wave = cos( delta * fdelta / float( blockSize ) * PI );
    sum += wave * val;
  }

  if ( isVert ) {
    sum = yuv2rgb( sum );
  }

  gl_FragColor = vec4( sum, 1.0 );
}