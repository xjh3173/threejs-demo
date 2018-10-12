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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/LoadViewController.js");
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

/***/ "./src/js/LoadViewController.js":
/*!**************************************!*\
  !*** ./src/js/LoadViewController.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

/*!
 * Loading Progress.
 * 
 * Copyright (c) 2018-2019 xjh.
 * Version: 1.0
 * Company: http://www.chinadci.com
 */

function LoadViewController() {

    // 公共变量
    var _that = this;

    // 私有变量
    var _private = {};

    _private.$pageEl = document.getElementsByClassName('c-loading')[0];

    _private.isInit = false;

    _private.end = false;

    // 初始化，包括整体页面
    _private.init = function () {
        if (_private.isInit === true) {
            return;
        }

        _private.dotArr = []; // 存点

        // 加载体现在页面上
        _private.$btnMusic = document.getElementsByClassName('btn-music')[0];

        _private.$inneBbox = document.getElementsByClassName('c-loading__orbits')[0];

        _private.$processText = document.getElementsByClassName('c-loading__text')[0];

        initProject();

        // 创建轨迹球
        _private.createTrackCanvas();

        _meteorView2.default.init();

        _private.gload = new _Config2.default.Preload(_Config2.default.pageImgs);

        _private.gload.onloading = function (p) {
            _private.$processText.innerHTML(p + '%');
            // console.log(p);
            // _private.processLineEl.css('width', p + '%');
        };

        _private.gload.onload = function () {
            _that.hide();
        };

        _private.gload.onfail = function (msg) {
            console.log(msg);
        };

        _private.isInit = true;

        _private.musicBg();
    };

    _private.createTrackCanvas = function () {

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var width = 320;
        var height = 320;

        canvas.width = width;
        canvas.height = height;

        canvas.style.width = width / 2 + 'px';
        canvas.style.height = height / 2 + 'px';

        _private.$inneBbox.appendChild(canvas);

        var dotConfig = _Config2.default.loadDot;

        var len = dotConfig.length;

        for (var i = 0; i < len; i++) {

            var dot = new _TrackDot2.default(context, dotConfig[i].speed, width, height, dotConfig[i].radiusX, dotConfig[i].radiusY, dotConfig[i].revise);
            dot.draw();
            _private.dotArr.push(dot);
        }

        // function _TrackDot2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        var animate = function animate() {

            if (_private.end) return false;

            context.clearRect(0, 0, width, height);

            _private.dotArr.forEach(function (dot) {

                dot.update();
                dot.draw();
            });

            requestAnimationFrame(animate);
        };

        animate();
    };

    // 背景音乐
    _private.musicBg = function () {

        _Config2.default.bgMusic.play();

        _private.$btnMusic.on('click', function () {

            if ($(this).hasClass('pause')) {

                _Config2.default.bgMusic.play();
                $(this).removeClass('pause');
            } else {

                _Config2.default.bgMusic.pause();
                $(this).addClass('pause');
            }
        });
    };

    // 显示
    _that.show = function () {
        _private.$pageEl.show();
    };

    // 隐藏
    _that.hide = function () {

        _that.onhide && _that.onhide();

        _private.$pageEl.addClass('hide');

        setTimeout(function () {
            _private.$pageEl.hide();

            _private.end = true;
            _private.dotArr.forEach(function (dot) {
                dot = null;
            });
        }, 310);
    };

    // 执行加载
    _that.load = function () {
        _private.gload.load();
    };

    _private.init();
};

module.export = LoadViewController;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ })

/******/ });