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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/MediaSprite.js");
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

/***/ "./src/js/MediaSprite.js":
/*!*******************************!*\
  !*** ./src/js/MediaSprite.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * Media Sprite.
 * 
 * Copyright (c) 2018-2019 xjh.
 * Version: 1.0
 * Company: http://www.chinadci.com
 */

/**
 *
 * @param options
 * @returns {MediaSprite}
 */

function MediaSprite(options) {
    options || (options = {});
    this.options = {
        media: options.media,
        mediaType: options.mediaType, // video, audio
        sprites: options.sprites || [],
        onReady: options.onReady || null,
        onSpriteEnd: options.onSpriteEnd || null
    };

    this.media = null;
    this.sprites = this.options.sprites; // array: [[0, 2], [2, 4]]; or object: { s1: [0, 1], s2: [2, 4] }
    this.currentSpriteKey = 0;
    this.repeatMode = false;

    // this.timeUpdateHandler = this._handleTimeUpdate
    // this.metaDataLoadedHandler = this._handleMetaDataLoaded

    this._init();
}

MediaSprite.prototype = {
    _init: function _init() {
        this._createMedia();
    },

    _createMedia: function _createMedia() {
        var media = this.options.media;
        var mediaType = this.options.mediaType;
        var mediaElement = null;

        if ((typeof media === 'undefined' ? 'undefined' : _typeof(media)) === 'object') {
            // about HTMLMediaElement readyState: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
            if (media.readyState >= 1) {
                setTimeout(function () {
                    this._handleMetaDataLoaded();
                }.bind(this), 0);
            }
        } else {
            mediaElement = document.createElement(mediaType);
            mediaElement.preload = 'metadata';
            mediaElement.addEventListener('loadedmetadata', this.metaDataLoadedHandler);
            mediaElement.src = media;
            media = mediaElement;
        }

        media.autoplay = false;
        this.media = media;
    },

    _handleTimeUpdate: function _handleTimeUpdate() {
        if (this.media.currentTime >= this.spriteRange()[1]) {
            this._handleSpriteEnd();

            if (this.repeatMode) {
                this._play(this.currentSpriteKey);
            } else {
                this.pause();
            }
        }
    },

    _handleMetaDataLoaded: function _handleMetaDataLoaded() {
        this.options.onReady && this.options.onReady();
    },

    _handleSpriteEnd: function _handleSpriteEnd() {
        this.media.removeEventListener('timeupdate', this._handleTimeUpdate.bind(this));
        setTimeout(function () {
            this.options.onSpriteEnd && this.options.onSpriteEnd();
        }.bind(this), 0);
    },

    _play: function _play() {
        var spriteKey = arguments[0];
        this.set(spriteKey);
        this.media.addEventListener('timeupdate', this._handleTimeUpdate.bind(this));
        this.media.play();
    },

    spriteRange: function spriteRange() {
        return this.sprites[arguments.length === 1 ? arguments[0] : this.currentSpriteKey];
    },

    play: function play() {
        if (arguments.length === 0) {
            console.error('MediaSprite.play() requires spriteKey as the first argument');
            return;
        }

        var spriteKey = arguments[0];
        this.repeatMode = false;
        this._play(spriteKey);
    },

    repeat: function repeat() {
        if (arguments.length === 0) {
            console.error('MediaSprite.repeat() requires spriteKey as the first argument');
            return;
        }
        var spriteKey = arguments[0];
        this.repeatMode = true;
        this._play(spriteKey);
    },

    pause: function pause() {
        this.media.pause();
    },

    set: function set() {
        var spriteKey = arguments[0];
        var range = this.spriteRange(spriteKey);

        if (!range) {
            console.error('MediaSprite error: invalid sprite key', spriteKey);
            return;
        }

        this.currentSpriteKey = spriteKey;
        this.media.currentTime = range[0];
    }
};

module.export = MediaSprite;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ })

/******/ });