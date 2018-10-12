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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/CenterIt.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/CenterIt.js":
/*!****************************!*\
  !*** ./src/js/CenterIt.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*!
 * CenterIt.
 * 
 * Copyright (c) 2018-2019 xjh.
 * Version: 1.0
 * Company: http://www.chinadci.com
 */

/**
 *
 * @param options
 * @returns {CenterIt}
 */
function CenterIt(options) {
    options = options || {};
    this.options = {
        containerWidth: 100,
        containerHeight: 100,
        originWidth: 100,
        originHeight: 100,
        centerType: 'cover' // 'cover', 'contain'
    };

    for (var p in this.options) {
        if (options[p] !== undefined) {
            this.options[p] = options[p];
        }
    }

    this._ratio = 1;
    this._newWidth = 0;
    this._newHeight = 0;
    this._offset = { top: 0, left: 0 };

    if (this.options.centerType === 'cover') {
        this._coverCenter();
    } else {
        this._containCenter();
    }
}

CenterIt.prototype = {
    _coverCenter: function _coverCenter() {
        var originWidth = this.options.originWidth;
        var originHeight = this.options.originHeight;
        var containerWidth = this.options.containerWidth;
        var containerHeight = this.options.containerHeight;
        var originRatio = originWidth / originHeight;
        var containerRatio = containerWidth / containerHeight;
        var ratio = 1;

        if (originRatio > containerRatio) {
            // left offset required
            ratio = containerHeight / originHeight;
            this._newWidth = originWidth * ratio;
            this._newHeight = originHeight * ratio;
            this._offset = {
                top: 0,
                left: (this._newWidth - containerWidth) / -2
            };
        } else if (originRatio < containerRatio) {
            // top offset required
            ratio = containerWidth / originWidth;
            this._newWidth = originWidth * ratio;
            this._newHeight = originHeight * ratio;
            this._offset = {
                top: (this._newHeight - containerHeight) / -2,
                left: 0
            };
        } else {
            // no offset required
            ratio = containerWidth / originWidth;
            this._newWidth = originWidth * ratio;
            this._newHeight = originHeight * ratio;
            this._offset = {
                top: 0,
                left: 0
            };
        }
        this._ratio = ratio;
    },

    _containCenter: function _containCenter() {
        var originWidth = this.options.originWidth;
        var originHeight = this.options.originHeight;
        var containerWidth = this.options.containerWidth;
        var containerHeight = this.options.containerHeight;
        var originRatio = originWidth / originHeight;
        var containerRatio = containerWidth / containerHeight;
        var ratio = 1;

        if (originRatio > containerRatio) {
            // top offset required
            ratio = containerWidth / originWidth;
            this._newWidth = originWidth * ratio;
            this._newHeight = originHeight * ratio;
            this._offset = {
                top: (this._newHeight - containerHeight) / -2,
                left: 0
            };
        } else if (originRatio < containerRatio) {
            // left offset required
            ratio = containerHeight / originHeight;
            this._newWidth = originWidth * ratio;
            this._newHeight = originHeight * ratio;
            this._offset = {
                top: 0,
                left: (this._newWidth - containerWidth) / -2
            };
        } else {
            // no offset required
            ratio = containerWidth / originWidth;
            this._newWidth = originWidth * ratio;
            this._newHeight = originHeight * ratio;
            this._offset = {
                top: 0,
                left: 0
            };
        }

        this._ratio = ratio;
    },

    ratio: function ratio() {
        return this._ratio;
    },

    width: function width() {
        return this._newWidth;
    },

    height: function height() {
        return this._newHeight;
    },

    offset: function offset() {
        return this._offset;
    },

    setPosition: function setPosition(el) {
        el.style.top = this.offset().top + 'px';
        el.style.left = this.offset().left + 'px';
        el.style.width = this.width() + 'px';
        el.style.height = this.height() + 'px';
    },

    drawImage: function drawImage(context, image) {
        if (this.options.centerType === 'cover') {
            context.drawImage(image, this.offset().left * -1 / this.ratio(), this.offset().top * -1 / this.ratio(), this.options.containerWidth / this.ratio(), this.options.containerHeight / this.ratio(), 0, 0, this.options.containerWidth, this.options.containerHeight);
        } else {
            context.drawImage(image, 0, 0, this.options.containerWidth / this.ratio(), this.options.containerHeight / this.ratio(), this.offset().left / this.ratio(), this.offset().top / this.ratio(), this.options.containerWidth, this.options.containerHeight);
        }
    }
};

module.exports = CenterIt;

/***/ })

/******/ });