(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"D:\\Dropbox\\pro\\_Projects\\_eom\\dct\\src\\script\\camera.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Camera = function Camera(width, height, callback) {
  _classCallCheck(this, Camera);

  var it = this;

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  window.URL = window.URL || window.webkitURL;

  it.video = document.createElement("video");
  it.video.autoplay = "true";
  it.video.width = width;
  it.video.height = height;
  it.localMediaStream = null;

  if (navigator.getUserMedia) {
    navigator.getUserMedia({ video: true, audio: false }, function (_stream) {
      it.localMediaStream = _stream;
      it.video.src = window.URL.createObjectURL(it.localMediaStream);
      if (typeof callback === "function") {
        callback();
      }
    }, function (_error) {
      console.error("getUserMedia error: ", _error.code);
    });
  } else {
    console.error("This browser does not support webcam");
  }
};

exports.default = Camera;

},{}],"D:\\Dropbox\\pro\\_Projects\\_eom\\dct\\src\\script\\glcat-path.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var requiredFields = function requiredFields(object, nanithefuck, fields) {
  fields.map(function (field) {
    if (typeof object[field] === "undefined") {
      throw "GLCat-Path: " + field + " is required for " + nanithefuck;
    }
  });
};

var Path = function () {
  function Path(glCat) {
    _classCallCheck(this, Path);

    var it = this;

    it.glCat = glCat;
    it.gl = glCat.gl;

    it.paths = {};
    it.globalFunc = function () {};
  }

  _createClass(Path, [{
    key: "add",
    value: function add(paths) {
      var it = this;

      for (var name in paths) {
        var path = paths[name];
        requiredFields(path, "path object", ["width", "height", "vert", "frag", "blend", "func"]);
        it.paths[name] = path;

        if (typeof path.depthTest === "undefined") {
          path.depthTest = true;
        }

        if (path.drawbuffers) {
          path.framebuffer = it.glCat.createDrawBuffers(path.width, path.height, path.drawbuffers);
        } else {
          path.framebuffer = it.glCat.createFloatFramebuffer(path.width, path.height);
        }
        path.program = it.glCat.createProgram(path.vert, path.frag);
      }
    }
  }, {
    key: "render",
    value: function render(name, out) {
      var _it$gl;

      var it = this;

      var path = it.paths[name];
      var framebuffer = typeof out !== "undefined" ? out : path.framebuffer;

      it.gl.viewport(0, 0, path.width, path.height);
      it.glCat.useProgram(path.program);
      it.gl.bindFramebuffer(it.gl.FRAMEBUFFER, framebuffer === null ? null : framebuffer.framebuffer);
      it.glCat.drawBuffers(path.drawbuffers ? path.drawbuffers : framebuffer === null ? [it.gl.BACK] : [it.gl.COLOR_ATTACHMENT0]);
      (_it$gl = it.gl).blendFunc.apply(_it$gl, _toConsumableArray(path.blend));
      if (path.clear) {
        var _it$glCat;

        (_it$glCat = it.glCat).clear.apply(_it$glCat, _toConsumableArray(path.clear));
      }
      path.depthTest ? it.gl.enable(it.gl.DEPTH_TEST) : it.gl.disable(it.gl.DEPTH_TEST);

      it.glCat.uniform2fv('resolution', [path.width, path.height]);
      it.globalFunc();
      path.func(path);
    }
  }, {
    key: "resize",
    value: function resize(name, width, height) {
      var it = this;

      var path = it.paths[name];

      path.width = width;
      path.height = height;
      if (path.drawbuffers) {
        path.framebuffer = it.glCat.createDrawBuffers(path.width, path.height, path.drawbuffers);
      } else {
        path.framebuffer = it.glCat.createFloatFramebuffer(path.width, path.height);
      }

      if (typeof path.onresize === "function") {
        path.onresize(path, width, height);
      }
    }
  }, {
    key: "setGlobalFunc",
    value: function setGlobalFunc(func) {
      this.globalFunc = func;
    }
  }, {
    key: "fb",
    value: function fb(name) {
      return this.paths[name].framebuffer;
    }
  }]);

  return Path;
}();

exports.default = Path;

},{}],"D:\\Dropbox\\pro\\_Projects\\_eom\\dct\\src\\script\\glcat.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var GLCat = function () {
	function GLCat(_gl) {
		_classCallCheck(this, GLCat);

		var it = this;

		it.gl = _gl;
		var gl = it.gl;

		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.getExtension('OES_texture_float');
		gl.getExtension('OES_float_linear');
		gl.getExtension('OES_half_float_linear');
		gl.getExtension('EXT_frag_depth');

		it.extDrawBuffers = gl.getExtension('WEBGL_draw_buffers');

		it.currentProgram = null;
	}

	_createClass(GLCat, [{
		key: 'createProgram',
		value: function createProgram(_vert, _frag, _onError) {

			var it = this;
			var gl = it.gl;

			var error = void 0;
			if (typeof _onError === 'function') {
				error = _onError;
			} else {
				error = function error(_str) {
					console.error(_str);
				};
			}

			var vert = gl.createShader(gl.VERTEX_SHADER);
			gl.shaderSource(vert, _vert);
			gl.compileShader(vert);
			if (!gl.getShaderParameter(vert, gl.COMPILE_STATUS)) {
				error(gl.getShaderInfoLog(vert));
				return null;
			}

			var frag = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(frag, _frag);
			gl.compileShader(frag);
			if (!gl.getShaderParameter(frag, gl.COMPILE_STATUS)) {
				error(gl.getShaderInfoLog(frag));
				return null;
			}

			var program = gl.createProgram();
			gl.attachShader(program, vert);
			gl.attachShader(program, frag);
			gl.linkProgram(program);
			if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
				program.locations = {};
				return program;
			} else {
				error(gl.getProgramInfoLog(program));
				return null;
			}
		}
	}, {
		key: 'useProgram',
		value: function useProgram(_program) {

			var it = this;
			var gl = it.gl;

			gl.useProgram(_program);
			it.currentProgram = _program;
		}
	}, {
		key: 'createVertexbuffer',
		value: function createVertexbuffer(_array) {

			var it = this;
			var gl = it.gl;

			var buffer = gl.createBuffer();

			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_array), gl.STATIC_DRAW);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);

			buffer.length = _array.length;
			return buffer;
		}
	}, {
		key: 'createIndexbuffer',
		value: function createIndexbuffer(_array) {

			var it = this;
			var gl = it.gl;

			var buffer = gl.createBuffer();

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(_array), gl.STATIC_DRAW);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

			buffer.length = _array.length;
			return buffer;
		}
	}, {
		key: 'attribute',
		value: function attribute(_name, _buffer, _stride) {

			var it = this;
			var gl = it.gl;

			var location = void 0;
			if (it.currentProgram.locations[_name]) {
				location = it.currentProgram.locations[_name];
			} else {
				location = gl.getAttribLocation(it.currentProgram, _name);
				it.currentProgram.locations[_name] = location;
			}

			gl.bindBuffer(gl.ARRAY_BUFFER, _buffer);
			gl.enableVertexAttribArray(location);
			gl.vertexAttribPointer(location, _stride, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, null);
		}
	}, {
		key: 'getUniformLocation',
		value: function getUniformLocation(_name) {

			var it = this;
			var gl = it.gl;

			var location = void 0;

			if (it.currentProgram.locations[_name]) {
				location = it.currentProgram.locations[_name];
			} else {
				location = gl.getUniformLocation(it.currentProgram, _name);
				it.currentProgram.locations[_name] = location;
			}

			return location;
		}
	}, {
		key: 'uniform1i',
		value: function uniform1i(_name, _value) {

			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform1i(location, _value);
		}
	}, {
		key: 'uniform1f',
		value: function uniform1f(_name, _value) {

			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform1f(location, _value);
		}
	}, {
		key: 'uniform2fv',
		value: function uniform2fv(_name, _value) {

			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform2fv(location, _value);
		}
	}, {
		key: 'uniform3fv',
		value: function uniform3fv(_name, _value) {

			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform3fv(location, _value);
		}
	}, {
		key: 'uniform4fv',
		value: function uniform4fv(_name, _value) {

			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform4fv(location, _value);
		}
	}, {
		key: 'uniformCubemap',
		value: function uniformCubemap(_name, _texture, _number) {

			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.activeTexture(gl.TEXTURE0 + _number);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, _texture);
			gl.uniform1i(location, _number);
		}
	}, {
		key: 'uniformTexture',
		value: function uniformTexture(_name, _texture, _number) {

			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.activeTexture(gl.TEXTURE0 + _number);
			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.uniform1i(location, _number);
		}
	}, {
		key: 'createTexture',
		value: function createTexture() {

			var it = this;
			var gl = it.gl;

			var texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.bindTexture(gl.TEXTURE_2D, null);

			return texture;
		}
	}, {
		key: 'textureFilter',
		value: function textureFilter(_texture, _filter) {

			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, _filter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, _filter);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'textureWrap',
		value: function textureWrap(_texture, _wrap) {

			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, _wrap);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, _wrap);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'setTexture',
		value: function setTexture(_texture, _image) {

			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _image);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'setTextureFromArray',
		value: function setTextureFromArray(_texture, _width, _height, _array) {

			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(_array));
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'setTextureFromFloatArray',
		value: function setTextureFromFloatArray(_texture, _width, _height, _array) {

			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, new Float32Array(_array));
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'copyTexture',
		value: function copyTexture(_texture, _width, _height) {

			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, _width, _height, 0);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'createCubemap',
		value: function createCubemap(_arrayOfImage) {

			var it = this;
			var gl = it.gl;

			// order : X+, X-, Y+, Y-, Z+, Z-
			var texture = gl.createTexture();

			gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
			for (var i = 0; i < 6; i++) {
				gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _arrayOfImage[i]);
			}
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

			return texture;
		}
	}, {
		key: 'createFramebuffer',
		value: function createFramebuffer(_width, _height) {

			var it = this;
			var gl = it.gl;

			var framebuffer = {};
			framebuffer.framebuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebuffer);

			framebuffer.depth = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depth);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, framebuffer.depth);

			framebuffer.texture = it.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			gl.bindTexture(gl.TEXTURE_2D, null);

			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebuffer.texture, 0);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			return framebuffer;
		}
	}, {
		key: 'resizeFramebuffer',
		value: function resizeFramebuffer(_framebuffer, _width, _height) {

			var it = this;
			var gl = it.gl;

			gl.bindFramebuffer(gl.FRAMEBUFFER, _framebuffer.framebuffer);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
	}, {
		key: 'createFloatFramebuffer',
		value: function createFloatFramebuffer(_width, _height) {

			var it = this;
			var gl = it.gl;

			var framebuffer = {};
			framebuffer.framebuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebuffer);

			framebuffer.depth = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depth);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, framebuffer.depth);

			framebuffer.texture = it.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, null);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.bindTexture(gl.TEXTURE_2D, null);

			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebuffer.texture, 0);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			return framebuffer;
		}
	}, {
		key: 'resizeFloatFramebuffer',
		value: function resizeFloatFramebuffer(_framebuffer, _width, _height) {

			var it = this;
			var gl = it.gl;

			gl.bindFramebuffer(gl.FRAMEBUFFER, _framebuffer.framebuffer);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, null);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
	}, {
		key: 'createDrawBuffers',
		value: function createDrawBuffers(_width, _height, _numDrawBuffers) {

			var it = this;
			var gl = it.gl;
			var ext = it.extDrawBuffers;

			if (ext.MAX_DRAW_BUFFERS_WEBGL < _numDrawBuffers) {
				throw "createDrawBuffers: MAX_DRAW_BUFFERS_WEBGL is " + ext.MAX_DRAW_BUFFERS_WEBGL;
			}

			var framebuffer = {};
			framebuffer.framebuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebuffer);

			framebuffer.depth = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depth);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, framebuffer.depth);

			framebuffer.textures = [];
			for (var i = 0; i < _numDrawBuffers; i++) {
				framebuffer.textures[i] = it.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, framebuffer.textures[i]);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, null);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.bindTexture(gl.TEXTURE_2D, null);

				gl.framebufferTexture2D(gl.FRAMEBUFFER, ext.COLOR_ATTACHMENT0_WEBGL + i, gl.TEXTURE_2D, framebuffer.textures[i], 0);
			}

			var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
			if (status !== gl.FRAMEBUFFER_COMPLETE) {
				throw "createDrawBuffers: gl.checkFramebufferStatus( gl.FRAMEBUFFER ) is " + status;
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			return framebuffer;
		}
	}, {
		key: 'drawBuffers',
		value: function drawBuffers(_numDrawBuffers) {

			var it = this;
			var gl = it.gl;
			var ext = it.extDrawBuffers;

			var array = [];
			if (typeof _numDrawBuffers === 'number') {
				for (var i = 0; i < _numDrawBuffers; i++) {
					array.push(ext.COLOR_ATTACHMENT0_WEBGL + i);
				}
			} else {
				array = array.concat(_numDrawBuffers);
			}
			ext.drawBuffersWEBGL(array);
		}
	}, {
		key: 'clear',
		value: function clear(_r, _g, _b, _a, _d) {

			var it = this;
			var gl = it.gl;

			var r = _r || 0.0;
			var g = _g || 0.0;
			var b = _b || 0.0;
			var a = typeof _a === 'number' ? _a : 1.0;
			var d = typeof _d === 'number' ? _d : 1.0;

			gl.clearColor(r, g, b, a);
			gl.clearDepth(d);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		}
	}, {
		key: 'render',
		value: function render(_props) {

			var it = this;
			var gl = it.gl;

			if (_props.viewport) {
				gl.viewport(_props.viewport[0], _props.viewport[1], _props.viewport[2], _props.viewport[3]);
			}
			if (_props.program) {
				it.useProgram(_props.program);
			}
			if (_props.framebuffer) {
				gl.bindFramebuffer(gl.FRAMEBUFFER, _props.framebuffer);
			}

			var clearBit = 0;
			if (_props.clearColor) {
				gl.clearColor(_props.clearColor[0], _props.clearColor[1], _props.clearColor[2], _props.clearColor[3]);
				clearBit = clearBit | gl.COLOR_BUFFER_BIT;
			}
			if (_props.clearDepth) {
				gl.clearDepth(gl.clearDepth);
				clearBit = clearBit | gl.DEPTH_BUFFER_BIT;
			}
			gl.clear;
		}
	}]);

	return GLCat;
}();

exports.default = GLCat;

},{}],"D:\\Dropbox\\pro\\_Projects\\_eom\\dct\\src\\script\\main.js":[function(require,module,exports){
'use strict';

var _xorshift = require('./xorshift');

var _xorshift2 = _interopRequireDefault(_xorshift);

var _glcat = require('./glcat');

var _glcat2 = _interopRequireDefault(_glcat);

var _glcatPath = require('./glcat-path');

var _glcatPath2 = _interopRequireDefault(_glcatPath);

var _step = require('./step');

var _step2 = _interopRequireDefault(_step);

var _tweak = require('./tweak');

var _tweak2 = _interopRequireDefault(_tweak);

var _camera = require('./camera');

var _camera2 = _interopRequireDefault(_camera);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(0, _xorshift2.default)(13487134006);




// ------

var clamp = function clamp(_value, _min, _max) {
  return Math.min(Math.max(_value, _min), _max);
};
var saturate = function saturate(_value) {
  return clamp(_value, 0.0, 1.0);
};

// ------

var width = 240;
var height = 240;
canvas.width = width;
canvas.height = height;

var gl = canvas.getContext('webgl');
var glCat = new _glcat2.default(gl);
var path = new _glcatPath2.default(glCat);

// ------

var tweak = new _tweak2.default(divTweak);

// ------

var totalFrame = 0;
var time = 0.0;
var dateBegin = +new Date();
var init = true;

var timeUpdate = function timeUpdate() {
  totalFrame++;
  init = false;

  var now = +new Date();
  time = (now - dateBegin) / 1000.0;
};

// ------

var vboQuad = glCat.createVertexbuffer([-1, -1, 1, -1, -1, 1, 1, 1]);

// ------

var textureRandomSize = 256;

var textureRandomUpdate = function textureRandomUpdate(_tex) {
  glCat.setTextureFromArray(_tex, textureRandomSize, textureRandomSize, function () {
    var len = textureRandomSize * textureRandomSize * 4;
    var ret = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      ret[i] = Math.floor((0, _xorshift2.default)() * 256.0);
    }
    return ret;
  }());
};

var textureInput = glCat.createTexture();
var camera = void 0;

var textureRandomStatic = glCat.createTexture();
glCat.textureWrap(textureRandomStatic, gl.REPEAT);
textureRandomUpdate(textureRandomStatic);

var textureRandom = glCat.createTexture();
glCat.textureWrap(textureRandom, gl.REPEAT);

// ------

var resize = function resize(w, h) {
  width = w;
  height = h;
  canvas.width = width;
  canvas.height = height;

  path.resize("input", width, height);
  path.resize("jpegCosine", width, height);
  path.resize("jpegRender", width, height);
};

// ------

path.setGlobalFunc(function () {
  glCat.uniform1i('init', init);
  glCat.uniform1f('time', time);
  glCat.uniform1i('blockSize', 8);
});

path.add({
  input: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "precision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform bool vflip;\nuniform sampler2D texture;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  if ( vflip ) { uv.y = 1.0 - uv.y; }\n  gl_FragColor = texture2D( texture, uv );\n}\n",
    blend: [gl.ONE, gl.ONE],
    clear: [0.0, 0.0, 0.0, 0.0],
    func: function func() {
      glCat.attribute('p', vboQuad, 2);
      glCat.uniform1i('vflip', 1);
      glCat.uniformTexture('texture', textureInput, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  jpegCosine: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define lofi(i,j) floor((i)/(j)+.5)*(j)\n#define PI 3.14159265\n\n// ------\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\n\nuniform bool isVert;\nuniform int blockSize;\nuniform sampler2D sampler0;\n\nuniform float highFreqMultiplier;\nuniform float quantizeY;\nuniform float quantizeYf;\nuniform float quantizeC;\nuniform float quantizeCf;\n\n// ------\n\nvec3 rgb2yuv( vec3 rgb ) {\n  return vec3(\n    0.299 * rgb.x + 0.587 * rgb.y + 0.114 * rgb.z,\n    -0.148736 * rgb.x - 0.331264 * rgb.y + 0.5 * rgb.z,\n    0.5 * rgb.x - 0.418688 * rgb.y - 0.081312 * rgb.z\n  );\n}\n\nvoid main() {\n  vec2 bv = ( isVert ? vec2( 0.0, 1.0 ) : vec2( 1.0, 0.0 ) );\n  vec2 block = bv * float( blockSize - 1 ) + vec2( 1.0 );\n  vec2 blockOrigin = 0.5 + floor( gl_FragCoord.xy / block ) * block;\n  int bs = int( min( float( blockSize ), dot( bv, resolution - blockOrigin + 0.5 ) ) );\n\n  float freq = floor( mod( dot( bv, gl_FragCoord.xy ), float( blockSize ) ) ) / float( bs ) * PI;\n  float factor = ( freq == 0.0 ? 1.0 : 2.0 ) / float( bs );\n\n  vec3 sum = vec3( 0.0 );\n  for ( int i = 0; i < 1024; i ++ ) {\n    if ( bs <= i ) { break; }\n\n    vec2 delta = float( i ) * bv;\n    float wave = cos( ( float( i ) + 0.5 ) * freq );\n\n    vec3 val = texture2D( sampler0, ( blockOrigin + delta ) / resolution ).xyz;\n    if ( !isVert ) { val = rgb2yuv( val ); }\n    sum += wave * factor * val;\n  }\n\n  if ( isVert ) {\n    float len = length( floor( mod( gl_FragCoord.xy, float( blockSize ) ) ) );\n\n    float qY = quantizeY + quantizeYf * len;\n    sum.x = 0.0 < qY ? lofi( sum.x, qY ) : sum.x;\n\n    float qC = quantizeC + quantizeCf * len;\n    sum.yz = 0.0 < qC ? lofi( sum.yz, qC ) : sum.yz;\n\n    sum *= 1.0 + len * highFreqMultiplier;\n  }\n\n  gl_FragColor = vec4( sum, 1.0 );\n}",
    blend: [gl.ONE, gl.ONE],
    clear: [0.0, 0.0, 0.0, 0.0],
    tempFb: glCat.createFloatFramebuffer(width, height),
    onresize: function onresize(path, w, h) {
      path.tempFb = glCat.createFloatFramebuffer(width, height);
    },
    func: function func(p) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, p.tempFb.framebuffer);
      glCat.clear.apply(glCat, _toConsumableArray(p.clear));

      glCat.attribute('p', vboQuad, 2);
      glCat.uniform1i('isVert', false);
      glCat.uniform1i('blockSize', tweak.range("blockSize", { min: 1, value: 8, max: 256, step: 1 }));
      glCat.uniformTexture('sampler0', path.fb("input").texture, 0);
      glCat.uniform1f('highFreqMultiplier', tweak.range("highFreqMul", { value: 0.0, max: 4.0 }));
      glCat.uniform1f('quantizeY', tweak.range("quantizeY", { max: 0.2 }));
      glCat.uniform1f('quantizeYf', tweak.range("quantizeYf", { max: 0.2 }));
      glCat.uniform1f('quantizeC', tweak.range("quantizeC", { max: 0.2 }));
      glCat.uniform1f('quantizeCf', tweak.range("quantizeCf", { max: 0.2 }));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.bindFramebuffer(gl.FRAMEBUFFER, p.framebuffer.framebuffer);

      glCat.attribute('p', vboQuad, 2);
      glCat.uniform1i('isVert', true);
      glCat.uniform1i('blockSize', tweak.range("blockSize"));
      glCat.uniform1f('highFreqMultiplier', tweak.range("highFreqMul"));
      glCat.uniform1f('quantizeY', tweak.range("quantizeY"));
      glCat.uniform1f('quantizeYf', tweak.range("quantizeYf"));
      glCat.uniform1f('quantizeC', tweak.range("quantizeC"));
      glCat.uniform1f('quantizeCf', tweak.range("quantizeCf"));
      glCat.uniformTexture('sampler0', p.tempFb.texture, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  jpegRender: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define lofi(i,j) floor((i)/(j)+.5)*(j)\n#define PI 3.14159265\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\n\nuniform bool isVert;\nuniform int blockSize;\nuniform sampler2D sampler0;\nuniform bool bypassRDCT;\nuniform bool showYCbCr;\n\n// ------\n\nbool validuv( vec2 v ) { return 0.0 < v.x && v.x < 1.0 && 0.0 < v.y && v.y < 1.0; }\n\nvec3 yuv2rgb( vec3 yuv ) {\n  return vec3(\n    yuv.x + 1.402 * yuv.z,\n    yuv.x - 0.344136 * yuv.y - 0.714136 * yuv.z,\n    yuv.x + 1.772 * yuv.y\n  );\n}\n\nvoid main() {\n  if ( bypassRDCT ) {\n    vec2 uv = gl_FragCoord.xy / resolution;\n    gl_FragColor = texture2D( sampler0, uv );\n    if ( isVert ) { gl_FragColor.xyz += 0.5; }\n    return;\n  }\n\n  vec2 bv = ( isVert ? vec2( 0.0, 1.0 ) : vec2( 1.0, 0.0 ) );\n  vec2 block = bv * float( blockSize - 1 ) + vec2( 1.0 );\n  vec2 blockOrigin = 0.5 + floor( gl_FragCoord.xy / block ) * block;\n  int bs = int( min( float( blockSize ), dot( bv, resolution - blockOrigin + 0.5 ) ) );\n\n  float delta = mod( dot( bv, gl_FragCoord.xy ), float( blockSize ) );\n  \n  vec3 sum = vec3( 0.0 );\n  for ( int i = 0; i < 1024; i ++ ) {\n    if ( bs <= i ) { break; }\n\n    float fdelta = float( i );\n\n    vec4 tex = texture2D( sampler0, ( blockOrigin + bv * fdelta ) / resolution );\n    vec3 val = tex.xyz;\n\n    float wave = cos( delta * fdelta / float( bs ) * PI );\n    sum += wave * val;\n  }\n\n  if ( isVert ) {\n    if ( showYCbCr ) {\n      sum.yz += 0.5;\n    } else {\n      sum = yuv2rgb( sum );\n    }\n  }\n\n  gl_FragColor = vec4( sum, 1.0 );\n}",
    blend: [gl.ONE, gl.ONE],
    clear: [0.0, 0.0, 0.0, 0.0],
    tempFb: glCat.createFloatFramebuffer(width, height),
    onresize: function onresize(path, w, h) {
      path.tempFb = glCat.createFloatFramebuffer(width, height);
    },
    func: function func(p) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, p.tempFb.framebuffer);
      glCat.clear.apply(glCat, _toConsumableArray(p.clear));

      glCat.attribute('p', vboQuad, 2);
      glCat.uniform1i('isVert', false);
      glCat.uniform1i('bypassRDCT', tweak.checkbox("bypassRDCT") ? 1 : 0);
      glCat.uniform1i('showYCbCr', tweak.checkbox("showYCbCr") ? 1 : 0);
      glCat.uniform1i('blockSize', tweak.range("blockSize"));
      glCat.uniformTexture('sampler0', path.fb("jpegCosine").texture, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      glCat.attribute('p', vboQuad, 2);
      glCat.uniform1i('isVert', true);
      glCat.uniform1i('bypassRDCT', tweak.checkbox("bypassRDCT") ? 1 : 0);
      glCat.uniform1i('showYCbCr', tweak.checkbox("showYCbCr") ? 1 : 0);
      glCat.uniform1i('blockSize', tweak.range("blockSize"));
      glCat.uniformTexture('sampler0', p.tempFb.texture, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }
});

// ------

var update = function update() {
  if (!tweak.checkbox('play', { value: true })) {
    setTimeout(update, 10);
    return;
  }

  textureRandomUpdate(textureRandom);

  if (tweak.checkbox('webcamMode', { value: false })) {
    if (!camera) {
      camera = new _camera2.default(640, 480);
    } else {
      glCat.setTexture(textureInput, camera.video);
    }
  }

  path.render("input");
  path.render("jpegCosine");
  path.render("jpegRender", null);

  timeUpdate();

  requestAnimationFrame(update);
};

// ------

(0, _step2.default)({
  0: function _(done) {
    var image = new Image();
    image.onload = function () {
      glCat.setTexture(textureInput, image);
      done();
    };
    image.src = "fms_cat.png";
  },

  1: function _(done) {
    update();
  }
});

inputFile.onchange = function () {
  var file = inputFile.files[0];
  var reader = new FileReader();
  reader.onload = function () {
    var image = new Image();
    image.onload = function () {
      tweak.checkbox('webcamMode', { set: false });
      glCat.setTexture(textureInput, image);
      resize(image.width, image.height);
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
};

window.addEventListener('keydown', function (_e) {
  if (_e.which === 27) {
    tweak.checkbox('play', { set: false });
  }
});

},{"./camera":"D:\\Dropbox\\pro\\_Projects\\_eom\\dct\\src\\script\\camera.js","./glcat":"D:\\Dropbox\\pro\\_Projects\\_eom\\dct\\src\\script\\glcat.js","./glcat-path":"D:\\Dropbox\\pro\\_Projects\\_eom\\dct\\src\\script\\glcat-path.js","./step":"D:\\Dropbox\\pro\\_Projects\\_eom\\dct\\src\\script\\step.js","./tweak":"D:\\Dropbox\\pro\\_Projects\\_eom\\dct\\src\\script\\tweak.js","./xorshift":"D:\\Dropbox\\pro\\_Projects\\_eom\\dct\\src\\script\\xorshift.js"}],"D:\\Dropbox\\pro\\_Projects\\_eom\\dct\\src\\script\\step.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var step = function step(_obj) {
  var obj = _obj;
  var count = -1;

  var func = function func() {
    count++;
    if (typeof obj[count] === 'function') {
      obj[count](func);
    }
  };
  func();
};

exports.default = step;

},{}],"D:\\Dropbox\\pro\\_Projects\\_eom\\dct\\src\\script\\tweak.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tweak = function () {
  function Tweak(_el) {
    _classCallCheck(this, Tweak);

    var it = this;

    it.parent = _el;
    it.values = {};
    it.elements = {};
  }

  _createClass(Tweak, [{
    key: 'button',
    value: function button(_name, _props) {
      var it = this;

      var props = _props || {};

      if (typeof it.values[_name] === 'undefined') {
        var div = document.createElement('div');
        it.parent.appendChild(div);

        var input = document.createElement('input');
        div.appendChild(input);
        input.type = 'button';
        input.value = _name;

        input.addEventListener('click', function () {
          it.values[_name] = true;
        });

        it.elements[_name] = {
          div: div,
          input: input
        };
      }

      var tempvalue = it.values[_name];
      it.values[_name] = false;
      if (typeof props.set === 'boolean') {
        it.values[_name] = props.set;
      }

      return tempvalue;
    }
  }, {
    key: 'checkbox',
    value: function checkbox(_name, _props) {
      var it = this;

      var props = _props || {};

      var value = void 0;

      if (typeof it.values[_name] === 'undefined') {
        value = props.value || false;

        var div = document.createElement('div');
        it.parent.appendChild(div);

        var name = document.createElement('span');
        div.appendChild(name);
        name.innerText = _name;

        var input = document.createElement('input');
        div.appendChild(input);
        input.type = 'checkbox';
        input.checked = value;

        it.elements[_name] = {
          div: div,
          name: name,
          input: input
        };
      } else {
        value = it.elements[_name].input.checked;
      }

      if (typeof props.set === 'boolean') {
        value = props.set;
      }

      it.elements[_name].input.checked = value;
      it.values[_name] = value;

      return it.values[_name];
    }
  }, {
    key: 'range',
    value: function range(_name, _props) {
      var it = this;

      var props = _props || {};

      var value = void 0;

      if (typeof it.values[_name] === 'undefined') {
        var min = typeof props.min === "number" ? props.min : 0.0;
        var max = typeof props.max === "number" ? props.max : 1.0;
        var step = typeof props.step === "number" ? props.step : 0.001;
        value = typeof props.value === "number" ? props.value : min;

        var div = document.createElement('div');
        it.parent.appendChild(div);

        var name = document.createElement('span');
        div.appendChild(name);
        name.innerText = _name;

        var input = document.createElement('input');
        div.appendChild(input);
        input.type = 'range';
        input.value = value;
        input.min = min;
        input.max = max;
        input.step = step;

        var val = document.createElement('span');
        val.innerText = value.toFixed(3);
        div.appendChild(val);
        input.addEventListener('input', function (_event) {
          var value = parseFloat(input.value);
          val.innerText = value.toFixed(3);
        });

        it.elements[_name] = {
          div: div,
          name: name,
          input: input,
          val: val
        };
      } else {
        value = parseFloat(it.elements[_name].input.value);
      }

      if (typeof props.set === 'number') {
        value = props.set;
      }

      it.values[_name] = value;
      it.elements[_name].input.value = value;

      return it.values[_name];
    }
  }]);

  return Tweak;
}();

exports.default = Tweak;

},{}],"D:\\Dropbox\\pro\\_Projects\\_eom\\dct\\src\\script\\xorshift.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var seed = void 0;
var xorshift = function xorshift(_seed) {
  seed = _seed || seed || 1;
  seed = seed ^ seed << 13;
  seed = seed ^ seed >>> 17;
  seed = seed ^ seed << 5;
  return seed / Math.pow(2, 32) + 0.5;
};

exports.default = xorshift;

},{}]},{},["D:\\Dropbox\\pro\\_Projects\\_eom\\dct\\src\\script\\main.js"]);
