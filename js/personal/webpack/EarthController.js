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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/EarthController.js");
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

/***/ "./src/js/EarthController.js":
/*!***********************************!*\
  !*** ./src/js/EarthController.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

/*!
 * Earth Controller.
 * 
 * Copyright (c) 2018-2019 xjh.
 * Version: 1.0
 * Company: http://www.chinadci.com
 */

/**
 *
 * @param options
 * @returns {EarthController}
 */

function EarthController(options) {
    options || (options = {});
    this.earth = options.earth;
    this.cloud = options.cloud;
    this.audioSprite = options.audioSprite;
    this.videoSprite = options.videoSprite;
    this.onStateChange = options.onStateChange;
    this.onTargetChange = options.onTargetChange;

    this.state = {
        tween: null,
        forward: function forward() {},
        backward: function backward() {}
    };
    this.touchDown = false;

    this.target = null;
    this.targetList = [];
    this.cameraFarPositions = [];

    this._init();
}

EarthController.prototype = {
    _init: function _init() {
        var _this = this;

        var that = this;
        setTimeout(function (_) {
            that.state = new EnteringState(_this);
        }, 800);
        LOCATIONS.map(function (location) {
            _this.cameraFarPositions.push([location.cameraFarPosition[0], location.cameraFarPosition[1]]);
        });
        this._shuffleTargetList();
        this._loop();
    },

    _shuffleTargetList: function _shuffleTargetList() {
        this.targetList = this._shuffle(LOCATIONS.map(function (location) {
            return location.name;
        }));
    },

    _loop: function _loop() {
        requestAnimationFrame(this._loop.bind(this));
        this._animate();
    },

    _animate: function _animate() {
        if (!this.state) {
            return;
        }

        if (this.state instanceof EnteringState) {
            this.state.forward();
        }

        if (this.state instanceof IdleState) {
            var cameraPosition = this.earth.cameraPosition();
            cameraPosition = [cameraPosition.x, cameraPosition.y];
            var index = this.getMinDistance(cameraPosition, this.cameraFarPositions);
            this.target = LOCATIONS[index];
        }

        if (this.touchDown && this.target) {
            this.state.forward();
        } else {
            this.state.backward();
        }
    },

    _shuffle: function _shuffle(arr) {
        arr.sort(randomsort);
        function randomsort(a, b) {
            return Math.random() > .5 ? -1 : 1;
        }
        return arr;
    },

    showEarth: function showEarth() {
        this.earth.container.style.display = 'block';
    },

    hideEarth: function hideEarth() {
        this.earth.container.style.display = 'none';
    },

    showCloud: function showCloud() {
        this.cloud.el.style.display = 'block';
    },

    hideCloud: function hideCloud() {
        this.cloud.el.style.display = 'none';
    },

    showVideo: function showVideo() {
        this.playSprite('video');
        this.videoSprite.media.style.display = 'block';
    },

    hideVideo: function hideVideo() {
        this.pauseSprite('video');
        this.videoSprite.media.style.display = 'none';
    },

    playSprite: function playSprite(type) {
        if (!this.target) {
            return;
        }

        if (type === 'video') {
            this.videoSprite.repeat(this.target.name);
        } else if (type === 'audio') {
            this.audioSprite.play(this.target.name);
        }
    },

    pauseSprite: function pauseSprite(type) {
        if (type === 'video') {
            this.videoSprite.pause();
        } else if (type === 'audio') {
            this.audioSprite.pause();
        }
    },

    start: function start() {
        this.touchDown = true;
        var box = document.getElementsByClassName('c-earthCover__coord')[0];
        var classVal = box.getAttribute('class');
        if (classVal.indexOf("show") == -1) {
            classVal = classVal.concat(" show");
            box.setAttribute("class", classVal);
        }

        var cameraPosition = this.earth.cameraPosition();
        cameraPosition = [cameraPosition.x, cameraPosition.y];
        var index = this.getMinDistance(cameraPosition, this.cameraFarPositions);
        box.style.backgroundPosition = LOCATIONS[index].backgroundPosition;
    },

    end: function end() {
        this.touchDown = false;
    },

    nextTarget: function nextTarget() {
        var nextTargetIndex = (this.targetList.indexOf(this.target ? this.target.name : null) + 1) % this.targetList.length;
        this.setTarget(this.targetList[nextTargetIndex]);
    },

    setTarget: function setTarget(locationName) {
        this.target = LOCATIONS.filter(function (location) {
            return location.name === locationName;
        })[0];
        this.playSprite('audio');
        this.videoSprite.set(locationName);
        this.onTargetChange && this.onTargetChange();
    },

    getMinDistance: function getMinDistance(coord, coords) {
        var _x, _y, dis, temp, result;
        coords.map(function (item, index) {
            _x = Math.abs(coord[0] - item[0]);
            _y = Math.abs(coord[1] - item[1]);
            temp = Math.sqrt(_x * _x + _y * _y);
            if (index == 0) {
                dis = temp;
                result = index;
            } else {
                if (dis > temp) {
                    dis = temp;
                    result = index;
                }
            }
        });
        return result;
    },

    changeState: function changeState(stateName) {
        switch (stateName) {
            case 'idle':
                var box = document.getElementsByClassName('c-earthCover')[0];
                var classVal = box.getAttribute('class');
                if (classVal.indexOf("fadeIn") == -1) {
                    classVal = classVal.concat(" fadeIn");
                    box.setAttribute("class", classVal);
                }
                this.state = new IdleState(this);
                break;
            case 'rotating':
                this.state = new RotatingState(this);
                break;
            case 'zooming':
                this.state = new ZoomingState(this);
                break;
            case 'diving':
                this.state = new DivingState(this);
                break;
            case 'presenting':
                this.state = new PresentingState(this);
                break;
            default:
                this.state = new BaseState(this);
        }
        this.onStateChange && this.onStateChange(stateName);
    }
};

/**
 *
 * @param controller
 * @returns {BaseState}
 */
function BaseState(controller) {
    this.controller = controller;
}

BaseState.prototype = {
    forward: function forward() {},
    backward: function backward() {}

    /**
     *
     * @param controller
     * @returns {EnteringState}
     */
};function EnteringState(controller) {
    BaseState.apply(this, arguments);
    this.tween = new TWEEN.Tween({
        x: 3.55, y: 0, z: -328, ry: 0
    }).to({
        x: 0, y: 0, z: -28, ry: Math.PI * -2
    }, 1600).onUpdate(function () {
        controller.earth.setCamera(this.x, this.y, this.z);
        controller.earth.earthGroup.rotation.y = this.ry;
    }).onComplete(function () {
        controller.changeState('idle');
    }).easing(TWEEN.Easing.Cubic.Out).start();
}

EnteringState.prototype = new BaseState();
EnteringState.prototype.constructor = EnteringState;
EnteringState.prototype.forward = function () {
    TWEEN.update();
};

/**
 *
 * @param controller
 * @returns {IdleState}
 */
function IdleState(controller) {
    BaseState.apply(this, arguments);
    if (!(controller.state instanceof EnteringState)) {
        controller.playSprite('audio');
    }
    controller.earth.controller.enabled = true;
}

IdleState.prototype = new BaseState();
IdleState.prototype.constructor = IdleState;
IdleState.prototype.forward = function () {
    this.controller.changeState('rotating');
};

/**
 *
 * @param controller
 * @returns {RotatingState}
 */
function RotatingState(controller) {
    BaseState.apply(this, arguments);
    this.tween = null;
    controller.pauseSprite('audio');
    controller.earth.controller.enabled = false;
}

RotatingState.prototype = new BaseState();
RotatingState.prototype.constructor = RotatingState;
RotatingState.prototype.forward = function () {
    var that = this;
    var earth = this.controller.earth;
    var target = this.controller.target;

    if (this.tween) {
        TWEEN.update();
    } else {
        this.tween = new TWEEN.Tween(earth.cameraPosition()).to({
            x: target.cameraFarPosition[0],
            y: target.cameraFarPosition[1],
            z: target.cameraFarPosition[2]
        }, 500).onUpdate(function () {
            earth.setCamera(this.x, this.y, this.z);
        }).onComplete(function () {
            that.controller.changeState('zooming');
            that.tween = null;
        }).start();
    }
};

RotatingState.prototype.backward = function () {
    if (this.tween) {
        TWEEN.update();
    } else {
        this.controller.state = new IdleState(this.controller);
    }
};

/**
 *
 * @param controller
 * @returns {ZoomingState}
 */
function ZoomingState(controller) {
    BaseState.apply(this, arguments);
    this.direction = '';
    this.tween = null;
    controller.hideCloud();
    controller.showEarth();
}

ZoomingState.prototype = new BaseState();
ZoomingState.prototype.constructor = ZoomingState;
ZoomingState.prototype._setDirection = function (direction) {
    var that = this;
    var earth = this.controller.earth;
    var target = this.controller.target;
    var from = earth.cameraPosition();
    var to = null;

    if (this.direction !== direction) {
        if (direction === 'forward') {
            to = {
                x: target.cameraNearPosition[0],
                y: target.cameraNearPosition[1],
                z: target.cameraNearPosition[2]
            };
        } else {
            to = {
                x: target.cameraFarPosition[0],
                y: target.cameraFarPosition[1],
                z: target.cameraFarPosition[2]
            };
        }

        this.direction = direction;
        this.tween && this.tween.stop();

        this.tween = new TWEEN.Tween(from).to(to, 1000).onUpdate(function () {
            earth.setCamera(this.x, this.y, this.z);
        }).onComplete(function () {
            that._handleTweenComplete();
        }).start();
    }
};
ZoomingState.prototype._handleTweenComplete = function () {
    if (this.direction === 'forward') {
        this.controller.changeState('diving');
    } else {
        this.controller.changeState('idle');
    }
    this.tween = null;
};
ZoomingState.prototype.forward = function () {
    this._setDirection('forward');
    if (this.tween) {
        TWEEN.update();
    }
};
ZoomingState.prototype.backward = function () {
    this._setDirection('backward');
    if (this.tween) {
        TWEEN.update();
    }
};

/**
 *
 * @param controller
 * @returns {DivingState}
 */
function DivingState(controller) {
    BaseState.apply(this, arguments);
    this.count = 0;
    controller.showCloud();
    controller.hideEarth();
    controller.hideVideo();
}

DivingState.prototype = new BaseState();
DivingState.prototype._throttle = function (fn) {
    if (this.count % 3 === 0) {
        fn && fn();
        this.count = 0;
    }
    this.count++;
};
DivingState.prototype.forward = function () {
    var cloud = this.controller.cloud;
    if (cloud.currentFrameIndex === cloud.images.length - 1) {
        this.controller.changeState('presenting');
    } else {
        this._throttle(function (_) {
            return cloud.next();
        });
    }
};
DivingState.prototype.backward = function () {
    var cloud = this.controller.cloud;
    if (cloud.currentFrameIndex === 0) {
        this.controller.changeState('zooming');
    } else {
        this._throttle(function (_) {
            return cloud.prev();
        });
    }
};

/**
 *
 * @param controller
 * @returns {PresentingState}
 */
function PresentingState(controller) {
    BaseState.apply(this, arguments);
    this.count = 0;
    controller.hideCloud();
    controller.showVideo();
}

PresentingState.prototype = new BaseState();
PresentingState.prototype.backward = function () {
    this.controller.changeState('diving');
};

module.export = EarthController;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ })

/******/ });