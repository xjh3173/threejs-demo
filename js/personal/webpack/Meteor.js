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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/Meteor.js");
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

/***/ "./src/js/Meteor.js":
/*!**************************!*\
  !*** ./src/js/Meteor.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

/*!
 * Create Meteor.
 * 
 * Copyright (c) 2018-2019 xjh.
 * Version: 1.0
 * Company: http://www.chinadci.com
 */

/**
 *
 * @param element
 * @returns {Meteor}
 */
var RANGE_TOTAL_STARS = [40, 50];
var RANGE_STAR_RADIUS = [1, 2];

function DCIMeteor(el) {
    this.el = el;
    this.meteorImage = null;
    this.width = window.innerWidth * 2;
    this.height = window.innerHeight * 2;
    this.context = null;

    this.stars = [];
    this.meteor = null;
    this.count = 0;

    this._init();
}

DCIMeteor.prototype = {
    _init: function _init() {
        this._loadImage();
        this._createCanvas();

        this._createStars();
        this._drawStars();

        this._createMeteor();
        this._drawMeteor();

        this._loop();
    },

    _loop: function _loop() {
        this.count++;
        if (this.stars.length > 0) {
            this.count % 10 === 0 && this._drawStars();
        }
        if (this.meteor && this.meteorImage) {
            if (this._flowMeteor()) {
                this.context.clearRect(this.meteor.x, this.meteor.y, 166, 130);
                this._createMeteor();
                this._drawMeteor();
            } else {
                this._moveMeteor();
            }
        }
        requestAnimationFrame(this._loop.bind(this));
    },

    _loadImage: function _loadImage() {
        var image = new Image();
        image.src = './img/bg_meteor.png';
        this.meteorImage = image;
    },

    _createCanvas: function _createCanvas() {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.style.width = this.width / 2 + 'px';
        canvas.style.height = this.height / 2 + 'px';

        this.el.appendChild(canvas);
        this.context = canvas.getContext('2d');
    },

    _createStars: function _createStars() {
        var total = this._random(RANGE_TOTAL_STARS[0], RANGE_TOTAL_STARS[1]);
        var width = this.width;
        var height = this.height;

        for (var i = 0; i < total; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                r: Math.random() + 1
            });
        }
    },

    _clear: function _clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    },

    _drawStars: function _drawStars() {
        var _this = this;

        var context = this.context;
        context.save();
        this.stars.forEach(function (star) {
            context.fillStyle = _this._getColor();
            context.beginPath();
            context.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
            context.fill();
        });
        context.restore();
    },

    _getColor: function _getColor() {
        var n = Math.random();
        var color = void 0;
        if (n < 0.5) {
            color = '#d6edff';
        } else {
            color = '#858bc5';
        }
        return color;
    },

    _createMeteor: function _createMeteor() {
        // setTimeout(() => {
        // let startX = Math.random() * this.width
        // let startY = Math.random() * this.height / 2

        var startX = this._random(this.width * 0.5, this.width * 1.5);
        var startY = this._random(this.height * -0.5, this.height * 0.5);

        this.meteor = {
            x: startX,
            y: startY,
            // fromX: startX,
            // fromY: startY,
            // toX: this.width * -0.1,
            // toY: this.height * 1.1,
            speed: Math.floor(Math.random() * 5 + 2)
            // }, this._random(0, 1))
        };
    },

    _drawMeteor: function _drawMeteor() {
        var context = this.context;
        context.save();
        if (this.meteorImage.complete) {
            context.drawImage(this.meteorImage, this.meteor.x, this.meteor.y);
        }
        context.restore();
    },

    _moveMeteor: function _moveMeteor() {
        this.context.clearRect(this.meteor.x, this.meteor.y, 166, 130);
        this.meteor.x -= this.meteor.speed;
        this.meteor.y += this.meteor.speed;
        this._drawMeteor();
    },

    _flowMeteor: function _flowMeteor() {
        if (this.meteor.y > this.height) {
            return true;
        } else {
            return false;
        }
    },

    _random: function _random(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.round(Rand * Range); //四舍五入
        return num;
    }
};

module.export = Meteor;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ })

/******/ });