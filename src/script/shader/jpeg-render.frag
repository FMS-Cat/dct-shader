#define lofi(i,j) floor((i)/(j)+.5)*(j)
#define PI 3.14159265

precision highp float;

uniform vec2 resolution;

uniform bool isVert;
uniform int blockSize;
uniform sampler2D sampler0;
uniform bool bypassRDCT;
uniform bool showYCbCr;

// ------

bool validuv( vec2 v ) { return 0.0 < v.x && v.x < 1.0 && 0.0 < v.y && v.y < 1.0; }

vec3 yuv2rgb( vec3 yuv ) {
  return vec3(
    yuv.x + 1.402 * yuv.z,
    yuv.x - 0.344136 * yuv.y - 0.714136 * yuv.z,
    yuv.x + 1.772 * yuv.y
  );
}

void main() {
  if ( bypassRDCT ) {
    vec2 uv = gl_FragCoord.xy / resolution;
    gl_FragColor = texture2D( sampler0, uv );
    if ( isVert ) { gl_FragColor.xyz += 0.5; }
    return;
  }

  vec2 bv = ( isVert ? vec2( 0.0, 1.0 ) : vec2( 1.0, 0.0 ) );
  vec2 block = bv * float( blockSize - 1 ) + vec2( 1.0 );
  vec2 blockOrigin = 0.5 + floor( gl_FragCoord.xy / block ) * block;
  int bs = int( min( float( blockSize ), dot( bv, resolution - blockOrigin + 0.5 ) ) );

  float delta = mod( dot( bv, gl_FragCoord.xy ), float( blockSize ) );
  
  vec3 sum = vec3( 0.0 );
  for ( int i = 0; i < 1024; i ++ ) {
    if ( bs <= i ) { break; }

    float fdelta = float( i );

    vec4 tex = texture2D( sampler0, ( blockOrigin + bv * fdelta ) / resolution );
    vec3 val = tex.xyz;

    float wave = cos( delta * fdelta / float( bs ) * PI );
    sum += wave * val;
  }

  if ( isVert ) {
    if ( showYCbCr ) {
      sum.yz += 0.5;
    } else {
      sum = yuv2rgb( sum );
    }
  }

  gl_FragColor = vec4( sum, 1.0 );
}