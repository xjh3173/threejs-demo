/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/ImageSprite.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./src/js/ImageSprite.js":
/*!*******************************!*\
  !*** ./src/js/ImageSprite.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

/*!
 * Image Sprite.
 * 
 * Copyright (c) 2018-2019 xjh.
 * Version: 1.0
 * Company: http://www.chinadci.com
 */

/**
 *
 * @param options
 * @returns {ImageSprite}
 */
function ImageSprite(el, options) {
    var defaultOptions = {
        width: 200,
        height: 200,
        mode: 'canvas', // dom
        interval: 16,
        images: [], // array of image url / element, or a sprite image
        onLoaded: null,
        onUpdate: null,
        onComplete: null
    };

    options = options || {};
    this.options = {};
    for (var p in defaultOptions) {
        if (options[p]) {
            this.options[p] = options[p];
        } else {
            this.options[p] = defaultOptions[p];
        }
    }

    this.el = typeof el === 'string' ? document.getElementById(el) : el;
    this.renderer = this.options.mode === 'canvas' ? new CanvasRenderer(this.options.width, this.options.height) : new DOMRenderer(this.options.width, this.options.height);
    this.images = [];

    this.isPlaying = false;
    this.playMode = null;
    this.direction = 'forward';
    this.interval = 1000 / 16;
    this.currentFrameIndex = -1;
    this.lastTick = 0;
    this.seedId = 0;

    this._init();
}

ImageSprite.prototype = {
    _init: function _init() {
        this.el.style.width = this.options.width + 'px';
        this.el.style.height = this.options.height + 'px';
        this.el.innerHTML = '';
        this.el.appendChild(this.renderer.domElement);
        this._load();
    },

    _load: function _load() {
        if (this.options.images.filter(function (image) {
            return typeof image === 'string';
        }).length === 0) {
            this._onLoad(this.options.images);
        } else {
            loadImages(this.options.images, function (results) {
                this._onLoad(results);
            }.bind(this));
        }
    },

    _onLoad: function _onLoad(results) {
        this.images = results;
        this.next();
        this._loop();
        this.options.onLoaded && this.options.onLoaded.bind(this)();
    },

    _loop: function _loop() {
        if (Date.now() - this.lastTick > this.interval) {
            if (this.isPlaying && !this.playMode.done()) {
                this.playMode.update();
                this.options.onUpdate && this.options.onUpdate.bind(this)();
            } else if (this.isPlaying && this.playMode.done()) {
                this.isPlaying = false;
                this.options.onComplete && this.options.onComplete.bind(this)();
            }
            this.lastTick = Date.now();
        }

        this.seedId = requestAnimationFrame(this._loop.bind(this));
    },

    _draw: function _draw() {
        var image = this.images[this.currentFrameIndex];
        image && this.renderer.drawImage(image);
    },

    play: function play(opts) {
        opts = opts || {};

        if (opts.loop === true) {
            this.playMode = new LoopMode(this);
        } else if (opts.repeat > 0) {
            this.playMode = new RepeatMode(this, opts.repeat);
        } else if (opts.byFrame > 0) {
            this.playMode = new ByFrameMode(this, opts.byFrame);
        } else if (opts.toFrame !== null && opts.toFrame !== undefined) {
            this.playMode = new ToFrameMode(this, getValidIndex(opts.toFrame, this.images.length));
        } else {
            this.playMode = new LoopMode(this);
        }

        this.direction = opts.direction || 'forward';
        this.interval = opts.interval || this.options.interval;
        this.isPlaying = true;
        this.lastTick = 0;
    },

    pause: function pause() {
        this.isPlaying = false;
    },

    next: function next() {
        this.currentFrameIndex = getValidIndex(this.currentFrameIndex + 1, this.images.length);
        this._draw();
    },

    prev: function prev() {
        this.currentFrameIndex = getValidIndex(this.currentFrameIndex - 1, this.images.length);
        this._draw();
    },

    jump: function jump(index) {
        this.currentFrameIndex = getValidIndex(index, this.images.length);
        this._draw();
    },

    destroy: function destroy() {
        cancelAnimationFrame(this.seedId);
        this.isPlaying = false;
        this.images = null;
        this.playMode = null;
    }

    /**
     *
     * @param width, height
     * @returns {Renderer}
     */
};function Renderer(width, height) {
    this.width = width;
    this.height = height;
    this.domElement = null;
}

Renderer.prototype = {
    _init: function _init() {},
    drawImage: function drawImage() {}

    /**
     *
     * @param width, height
     * @returns {DomRender}
     */
};function DOMRenderer(width, height) {
    Renderer.apply(this, arguments);
    this.images = [];
    this._init();
}

DOMRenderer.prototype = inherit(Renderer.prototype, {
    constructor: DOMRenderer,

    _init: function _init() {
        var div = document.createElement('div');
        div.style.display = 'inline-block';
        div.style.position = 'absolute';
        div.style.margin = 0;
        div.style.padding = 0;
        this.domElement = div;
    },

    _styleImage: function _styleImage(image) {
        image.style.position = 'absolute';
        image.style.top = 0;
        image.style.left = 0;
        image.style.width = this.width + 'px';
        image.style.height = this.height + 'px';
    },

    drawImage: function drawImage(image) {
        if (this.images.indexOf(image) === -1) {
            this.images.forEach(function (img) {
                img.style.opacity = 0;
            });
            this._styleImage(image);
            this.domElement.appendChild(image);
            this.images.push(image);
        } else {
            this.images.forEach(function (img) {
                if (img === image) {
                    img.style.opacity = 1;
                } else {
                    img.style.opacity = 0;
                }
            });
        }
    }
});

/**
 *
 * @param width, height
 * @returns {CanvasRenderer}
 */
function CanvasRenderer(width, height) {
    Renderer.apply(this, arguments);
    this.context = null;
    this._init();
}

CanvasRenderer.prototype = inherit(Renderer.prototype, {
    constructor: CanvasRenderer,

    _init: function _init() {
        var canvas = document.createElement('canvas');
        canvas.width = canvas.style.width = this.width;
        canvas.height = canvas.style.height = this.height;
        this.context = canvas.getContext('2d');
        this.domElement = canvas;
    },

    drawImage: function drawImage(image) {
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.drawImage(image, 0, 0, this.width, this.height);
    }
});

/**
 *
 * @param imageSprite
 * @returns {PlayMode}
 */
function PlayMode(imageSprite) {
    this.imageSprite = imageSprite;
    this.direction = 'forward';
}

PlayMode.prototype.updateDirection = function () {
    var imageSprite = this.imageSprite;

    if (imageSprite.direction === 'alternate') {
        if (imageSprite.currentFrameIndex === 0 || imageSprite.currentFrameIndex === imageSprite.images.length - 1) {
            this.direction = this.direction === 'forward' ? 'backward' : 'forward';
        }
    } else {
        this.direction = imageSprite.direction;
    }
};

PlayMode.prototype.update = function () {
    var imageSprite = this.imageSprite;

    if (this.direction === 'forward') {
        imageSprite.next();
    } else {
        imageSprite.prev();
    }

    this.updateDirection();
};

/* LoopMode class */
function LoopMode() {
    PlayMode.apply(this, arguments);
}

LoopMode.prototype = inherit(PlayMode.prototype, {
    constructor: LoopMode,

    done: function done() {
        return false;
    }
});

/* RepeatMode class */
function RepeatMode(imageSprite, repeat) {
    PlayMode.apply(this, arguments);
    this.repeat = repeat;
    this.count = 0;
    this.startFrameIndex = imageSprite.currentFrameIndex;
}

RepeatMode.prototype = inherit(PlayMode.prototype, {
    constructor: RepeatMode,

    done: function done() {
        return this.count === this.repeat;
    },

    update: function update() {
        PlayMode.prototype.update.apply(this);
        if (this.imageSprite.currentFrameIndex === this.startFrameIndex) {
            ++this.count;
        }
    }
});

/* ByFrameMode class */
function ByFrameMode(imageSprite, totalFrames) {
    PlayMode.apply(this, arguments);
    this.count = 0;
    this.total = totalFrames;
}

ByFrameMode.prototype = inherit(PlayMode.prototype, {
    constructor: ByFrameMode,

    done: function done() {
        return this.count === this.total;
    },

    update: function update() {
        PlayMode.prototype.update.apply(this);
        ++this.count;
    }
});

/* ToFrameMode class */
function ToFrameMode(imageSprite, targetFrameIndex) {
    PlayMode.apply(this, arguments);
    this.targetFrameIndex = targetFrameIndex;
}

ToFrameMode.prototype = inherit(PlayMode.prototype, {
    constructor: ToFrameMode,

    done: function done() {
        return this.imageSprite.currentFrameIndex === this.targetFrameIndex;
    }
});

module.export = ImageSprite;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ })

/******/ });