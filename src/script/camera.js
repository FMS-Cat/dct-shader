let Camera = class {
  constructor( width, height, callback ) {
    let it = this;
  
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL = window.URL || window.webkitURL;
  
    it.video = document.createElement( "video" );
    it.video.autoplay = "true";
    it.video.width = width;
    it.video.height = height;
    it.localMediaStream = null;
  
    if ( navigator.getUserMedia ) {
      navigator.getUserMedia(
        { video : true, audio : false },
        ( _stream ) => {
          it.localMediaStream = _stream;
          it.video.src = window.URL.createObjectURL( it.localMediaStream );
          if ( typeof callback === "function" ) { callback(); }
        }, ( _error ) => {
          console.error( "getUserMedia error: ", _error.code );
        }
      );
    } else {
      console.error( "This browser does not support webcam" );
    }
  }
};

export default Camera;