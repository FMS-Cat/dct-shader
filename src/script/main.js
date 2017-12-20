import xorshift from './xorshift';
xorshift( 13487134006 );
import GLCat from './glcat';
import Path from './glcat-path';
import step from './step';
import Tweak from './tweak';
import Camera from './camera';

const glslify = require( 'glslify' );

// ------

const clamp = ( _value, _min, _max ) => Math.min( Math.max( _value, _min ), _max );
const saturate = ( _value ) => clamp( _value, 0.0, 1.0 );

// ------

let width = 240;
let height = 240;
canvas.width = width;
canvas.height = height;

let gl = canvas.getContext( 'webgl' );
let glCat = new GLCat( gl );
let path = new Path( glCat );

// ------

let tweak = new Tweak( divTweak );

// ------

let totalFrame = 0;
let time = 0.0;
let dateBegin = +new Date();
let init = true;

let timeUpdate = () => {
  totalFrame ++;
  init = false;

  let now = +new Date();
  time = ( now - dateBegin ) / 1000.0;
};

// ------

let vboQuad = glCat.createVertexbuffer( [ -1, -1, 1, -1, -1, 1, 1, 1 ] );

// ------

let textureRandomSize = 256;

let textureRandomUpdate = ( _tex ) => {
  glCat.setTextureFromArray( _tex, textureRandomSize, textureRandomSize, ( () => {
    let len = textureRandomSize * textureRandomSize * 4;
    let ret = new Uint8Array( len );
    for ( let i = 0; i < len; i ++ ) {
      ret[ i ] = Math.floor( xorshift() * 256.0 );
    }
    return ret;
  } )() );
};


let textureInput = glCat.createTexture();
let camera;

let textureRandomStatic = glCat.createTexture();
glCat.textureWrap( textureRandomStatic, gl.REPEAT );
textureRandomUpdate( textureRandomStatic );

let textureRandom = glCat.createTexture();
glCat.textureWrap( textureRandom, gl.REPEAT );

// ------

let resize = ( w, h ) => {
  width = w;
  height = h;
  canvas.width = width;
  canvas.height = height;

  path.resize( "jpegCosine", width, height );
  path.resize( "jpegRender", width, height );
};

// ------

path.setGlobalFunc( () => {
  glCat.uniform1i( 'init', init );
  glCat.uniform1f( 'time', time );
  glCat.uniform1i( 'blockSize', 8 );
} );

path.add( {
  jpegCosine: {
    width: width,
    height: height,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/jpeg-cosine.frag' ),
    blend: [ gl.ONE, gl.ZERO ],
    clear: [ 0.0, 0.0, 0.0, 0.0 ],
    tempFb: glCat.createFloatFramebuffer( width, height ),
    onresize: ( path, w, h ) => { path.tempFb = glCat.createFloatFramebuffer( width, height ); },
    func: ( p ) => {
      gl.bindFramebuffer( gl.FRAMEBUFFER, p.tempFb.framebuffer );
      glCat.clear( ...p.clear );

      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniform1i( 'isVert', false );
      glCat.uniform1i( 'blockSize', tweak.range( "blockSize", { min: 1, value: 8, max: 256, step: 1 } ) );
      glCat.uniformTexture( 'sampler0', textureInput, 0 );
      glCat.uniform1f( 'highFreqMultiplier', tweak.range( "highFreqMul", { value: 0.0, max: 4.0 } ) );
      glCat.uniform1f( 'quantizeY', tweak.range( "quantizeY", { max: 0.2 } ) );
      glCat.uniform1f( 'quantizeYf', tweak.range( "quantizeYf", { max: 0.2 } ) );
      glCat.uniform1f( 'quantizeC', tweak.range( "quantizeC", { max: 0.2 } ) );
      glCat.uniform1f( 'quantizeCf', tweak.range( "quantizeCf", { max: 0.2 } ) );
      glCat.uniform1f( 'quantizeA', tweak.range( "quantizeA", { max: 0.2 } ) );
      glCat.uniform1f( 'quantizeAf', tweak.range( "quantizeAf", { max: 0.2 } ) );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

      gl.bindFramebuffer( gl.FRAMEBUFFER, p.framebuffer.framebuffer );

      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniform1i( 'isVert', true );
      glCat.uniform1i( 'blockSize', tweak.range( "blockSize" ) );
      glCat.uniform1f( 'highFreqMultiplier', tweak.range( "highFreqMul" ) );
      glCat.uniform1f( 'quantizeY', tweak.range( "quantizeY" ) );
      glCat.uniform1f( 'quantizeYf', tweak.range( "quantizeYf" ) );
      glCat.uniform1f( 'quantizeC', tweak.range( "quantizeC" ) );
      glCat.uniform1f( 'quantizeCf', tweak.range( "quantizeCf" ) );
      glCat.uniform1f( 'quantizeA', tweak.range( "quantizeA" ) );
      glCat.uniform1f( 'quantizeAf', tweak.range( "quantizeAf" ) );
      glCat.uniformTexture( 'sampler0', p.tempFb.texture, 0 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },
    
  jpegRender: {
    width: width,
    height: height,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/jpeg-render.frag' ),
    blend: [ gl.ONE, gl.ZERO ],
    clear: [ 0.0, 0.0, 0.0, 0.0 ],
    tempFb: glCat.createFloatFramebuffer( width, height ),
    onresize: ( path, w, h ) => { path.tempFb = glCat.createFloatFramebuffer( width, height ); },
    func: ( p ) => {
      gl.bindFramebuffer( gl.FRAMEBUFFER, p.tempFb.framebuffer );
      glCat.clear( ...p.clear );

      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniform1i( 'isVert', false );
      glCat.uniform1i( 'bypassRDCT', tweak.checkbox( "bypassRDCT" ) ? 1 : 0 );
      glCat.uniform1i( 'showYCbCr', tweak.checkbox( "showYCbCr" ) ? 1 : 0 );
      glCat.uniform1i( 'blockSize', tweak.range( "blockSize" ) );
      glCat.uniformTexture( 'sampler0', path.fb( "jpegCosine" ).texture, 0 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
      
      gl.bindFramebuffer( gl.FRAMEBUFFER, null );
      gl.blendFunc( gl.SRC_ALPHA, gl.ZERO );

      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniform1i( 'isVert', true );
      glCat.uniform1i( 'bypassRDCT', tweak.checkbox( "bypassRDCT" ) ? 1 : 0 );
      glCat.uniform1i( 'showYCbCr', tweak.checkbox( "showYCbCr" ) ? 1 : 0 );
      glCat.uniform1i( 'blockSize', tweak.range( "blockSize" ) );
      glCat.uniformTexture( 'sampler0', p.tempFb.texture, 0 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  }
} );

// ------

let update = () => {
  if ( !tweak.checkbox( 'play', { value: true } ) ) {
    setTimeout( update, 10 );
    return;
  }
  
  textureRandomUpdate( textureRandom );

  if ( tweak.checkbox( 'webcamMode', { value: false } ) ) {
    if ( !camera ) {
      camera = new Camera( 640, 480 );
    } else {
      glCat.setTexture( textureInput, camera.video );
    }
  }

  path.render( "jpegCosine" );
  path.render( "jpegRender", null );

  timeUpdate();
  
  requestAnimationFrame( update );
};

// ------

step( {
  0: ( done ) => {
    let image = new Image();
    image.onload = () => {
      glCat.setTexture( textureInput, image );
      done();
    };
    image.src = "fms_cat.png";
  },

  1: ( done ) => {
    update();
  }
} );

inputFile.onchange = () => {
  let file = inputFile.files[ 0 ];
  let reader = new FileReader();
  reader.onload = () => {
    let image = new Image();
    image.onload = () => {
      tweak.checkbox( 'webcamMode', { set: false } )
      glCat.setTexture( textureInput, image );
      resize( image.width, image.height );
    };
    image.src = reader.result;
  };
  reader.readAsDataURL( file );
};

window.addEventListener( 'keydown', ( _e ) => {
  if ( _e.which === 27 ) {
    tweak.checkbox( 'play', { set: false } );
  }
} );