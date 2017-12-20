#define lofi(i,j) floor((i)/(j)+.5)*(j)
#define PI 3.14159265

// ------

precision highp float;

uniform vec2 resolution;

uniform bool isVert;
uniform int blockSize;
uniform sampler2D sampler0;

uniform float highFreqMultiplier;
uniform float quantizeY;
uniform float quantizeYf;
uniform float quantizeC;
uniform float quantizeCf;

// ------

vec3 rgb2yuv( vec3 rgb ) {
  return vec3(
    0.299 * rgb.x + 0.587 * rgb.y + 0.114 * rgb.z,
    -0.148736 * rgb.x - 0.331264 * rgb.y + 0.5 * rgb.z,
    0.5 * rgb.x - 0.418688 * rgb.y - 0.081312 * rgb.z
  );
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 bv = ( isVert ? vec2( 0.0, 1.0 ) : vec2( 1.0, 0.0 ) );
  vec2 block = bv * float( blockSize - 1 ) + vec2( 1.0 );
  vec2 blockOrigin = 0.5 + floor( gl_FragCoord.xy / block ) * block;

  float freq = floor( mod( isVert ? gl_FragCoord.y : gl_FragCoord.x, float( blockSize ) ) ) / float( blockSize ) * PI;
  float factor = ( freq == 0.0 ? 1.0 : 2.0 ) / float( blockSize );

  vec3 sum = vec3( 0.0 );
  for ( int i = 0; i < 1024; i ++ ) {
    if ( blockSize <= i ) { break; }

    vec2 delta = float( i ) * bv;
    float wave = cos( ( float( i ) + 0.5 ) * freq );

    vec3 val = texture2D( sampler0, ( blockOrigin + delta ) / resolution ).xyz;
    if ( !isVert ) { val = rgb2yuv( val ); }
    sum += wave * factor * val;
  }

  if ( isVert ) {
    float len = length( floor( mod( gl_FragCoord.xy, float( blockSize ) ) ) );

    float qY = quantizeY + quantizeYf * len;
    sum.x = 0.0 < qY ? lofi( sum.x, qY ) : sum.x;

    float qC = quantizeC + quantizeCf * len;
    sum.yz = 0.0 < qC ? lofi( sum.yz, qC ) : sum.yz;

    sum *= 1.0 + len * highFreqMultiplier;
  }

  gl_FragColor = vec4( sum, 1.0 );
}