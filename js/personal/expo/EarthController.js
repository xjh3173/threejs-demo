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
    options || (options = {})
    this.earth = options.earth
    this.cloud = options.cloud
    this.audioSprite = options.audioSprite
    this.videoSprite = options.videoSprite
    this.onStateChange = options.onStateChange
    this.onTargetChange = options.onTargetChange

    this.state = {
        tween: null,
        forward: function(){},
        backward: function(){},
    }
    this.touchDown = false

    this.target = null
    this.targetList = []
    this.cameraFarPositions = []

    this._init()
}

EarthController.prototype = {
    _init:function () {
        let that = this;
        setTimeout(_ => { that.state = new EnteringState(this); }, 1000)
        LOCATIONS.map((location) => {
            this.cameraFarPositions.push([location.cameraFarPosition[0], location.cameraFarPosition[1]])
        })
        this._shuffleTargetList()
        this._loop()
    },

    _shuffleTargetList:function () {
        this.targetList = this._shuffle(LOCATIONS.map(location => location.name))
    },

    _loop:function () {
        requestAnimationFrame(this._loop.bind(this))
        this._animate()
    },

    _animate:function () {
        if (!this.state) {
            return
        }

        if (this.state instanceof EnteringState) {
            this.state.forward()
        }

        if (this.touchDown && this.target) {
            this.state.forward()
        } else {
            this.state.backward()
        }
    },

    _shuffle:function(arr) {
        arr.sort(randomsort);
        function randomsort(a, b) {
            return Math.random()>.5 ? -1 : 1;
        }
        return arr;
    },

    showEarth:function () {
        this.earth.container.style.display = 'block'
    },

    hideEarth:function () {
        this.earth.container.style.display = 'none'
    },

    showCloud:function () {
        this.cloud.el.style.display = 'block'
    },

    hideCloud:function () {
        this.cloud.el.style.display = 'none'
    },

    showVideo:function () {
        this.playSprite('video')
        this.videoSprite.media.style.display = 'block'
    },

    hideVideo:function () {
        this.pauseSprite('video')
        this.videoSprite.media.style.display = 'none'
    },

    playSprite:function (type) {
        if (!this.target) {
            return
        }

        if (type === 'video') {
            this.videoSprite.repeat(this.target.name)
        } else if (type === 'audio') {
            this.audioSprite.play(this.target.name)
        }
    },

    pauseSprite:function (type) {
        if (type === 'video') {
            this.videoSprite.pause()
        } else if (type === 'audio') {
            this.audioSprite.pause()
        }
    },

    start:function (object) {
        this.touchDown = true
        this.target = object.userData.target
    },

    end:function () {
        this.touchDown = false
        this.target = null
    },

    nextTarget:function () {
        let nextTargetIndex = (this.targetList.indexOf(this.target ? this.target.name : null) + 1) % this.targetList.length
        this.setTarget(this.targetList[nextTargetIndex])
    },

    setTarget:function (locationName) {
        this.target = LOCATIONS.filter(location => location.name === locationName)[0]
        this.playSprite('audio')
        this.videoSprite.set(locationName)
        this.onTargetChange && this.onTargetChange()
    },

    getMinDistance: function(coord, coords){
        var _x, _y, dis, temp, result;
        coords.map(function(item, index){
            _x = Math.abs(coord[0] - item[0]);
            _y = Math.abs(coord[1] - item[1]);
            temp = Math.sqrt(_x * _x + _y * _y);
            if(index == 0){
                dis = temp;
                result = index;
            }else{
                if(dis > temp){
                    dis = temp;
                    result = index;
                }
            }
        });
        return result;
    },

    changeState:function (stateName) {
        switch (stateName) {
            case 'idle':
                // var box = document.getElementsByClassName('c-earthCover')[0];
                // var classVal = box.getAttribute('class');
                // if(classVal.indexOf("fadeIn") == -1){
                //     classVal = classVal.concat(" fadeIn");
                //     box.setAttribute("class", classVal );
                // }
                this.state = new IdleState(this)
                break
            case 'rotating':
                this.state = new RotatingState(this)
                break
            case 'mtr':
                this.state = new MoveToRightState(this)
                break
            case 'zooming':
                this.state = new ZoomingState(this)
                break
            case 'diving':
                this.state = new DivingState(this)
                break
            case 'presenting':
                this.state = new PresentingState(this)
                break
            default:
                this.state = new BaseState(this)
        }
        this.onStateChange && this.onStateChange(stateName)
    }
};

/**
 *
 * @param controller
 * @returns {BaseState}
 */
function BaseState(controller) {
    this.controller = controller
}

BaseState.prototype = {
    forward:function () {},
    backward:function () {}
}

/**
 *
 * @param controller
 * @returns {EnteringState}
 */
function EnteringState(controller) {
    BaseState.apply(this, arguments);
    let that = this
    this.tween = new TWEEN.Tween({
        x: 3.55, y: 0, z: -328, ry: 0
    }).to({
        x: 0, y: 0, z: -28, ry: Math.PI * -2
    }, 1600).onUpdate(function () {
        controller.earth.setCamera(this.x, this.y, this.z)
        controller.earth.earthGroup.rotation.y = this.ry
    }).onComplete(function () {
        this.tween = new TWEEN.Tween({
            opacity: 0
        }).to({
            opacity: 1
        }, 500).easing(TWEEN.Easing.Quadratic.Out).onUpdate(function () {
            let demo = that.controller.earth.earthGroup.getObjectByName("dome")
            demo.material.opacity = this.opacity
        }).onComplete(function () {
            controller.changeState('idle')
        }).start()
    }).easing(TWEEN.Easing.Cubic.Out).start()
}

EnteringState.prototype = new BaseState;
EnteringState.prototype.constructor = EnteringState;
EnteringState.prototype.forward = function(){ TWEEN.update() };

/**
 *
 * @param controller
 * @returns {IdleState}
 */
function IdleState(controller) {
    BaseState.apply(this, arguments);
    // if (!(controller.state instanceof EnteringState)) {
    //     controller.playSprite('audio')
    // }
    controller.earth.controller.enabled = true
    controller.earth.controller.autoRotate = true
}

IdleState.prototype = new BaseState;
IdleState.prototype.constructor = IdleState;
IdleState.prototype.forward = function(){ this.controller.changeState('rotating') };

/**
 *
 * @param controller
 * @returns {RotatingState}
 */
function RotatingState(controller) {
    BaseState.apply(this, arguments);
    this.tween = null
    controller.earth.controller.enabled = false
    controller.earth.controller.autoRotate = false
}

RotatingState.prototype = new BaseState;
RotatingState.prototype.constructor = RotatingState;
RotatingState.prototype.forward = function(){
    let that = this
    let earth = this.controller.earth
    let target = this.controller.target

    if (this.tween) {
        TWEEN.update()
    } else {
        let r = that.controller.earth.camera.position.distanceTo(that.controller.earth.earthGroup.position)
        let position = getPosition(target.coord, r)
        this.tween = new TWEEN.Tween(earth.cameraPosition()).to({
            x: position.x,
            y: position.y,
            z: position.z
        }, 1000).easing(TWEEN.Easing.Quadratic.Out).onUpdate(function () {
            earth.camera.position.set(this.x, this.y, this.z)
        }).onComplete(function () {
            that.controller.changeState('mtr')
            // that.controller.touchDown = false
            that.tween = null

            that.controller.earth.earthGroup.children.filter(function (L) {
                return "Sprite" === L.type
            }).forEach(function (M) {
                -1 === target ? M.material.opacity = 1 : M.name === target.imageName ? M.material.opacity = 1 : M.material.opacity = 0
            })
        }).start()
    }
};

RotatingState.prototype.backward = function() {
    if (this.tween) {
        TWEEN.update()
    } else {
        this.controller.state = new IdleState(this.controller)
    }
}

/**
 *
 * @param controller
 * @returns {MoveToRightState}
 */
function MoveToRightState(controller) {
    BaseState.apply(this, arguments);
    this.tween = null
    this.tween2 = null
    this.moveFlag = false
    this.firstBack = true
    // controller.earth.controller.enabled = true
}

MoveToRightState.prototype = new BaseState;
MoveToRightState.prototype.constructor = MoveToRightState;
MoveToRightState.prototype.forward = function(){
    let that = this
    let earth = this.controller.earth
    let orbitController = earth.controller
    let cTarget = orbitController.target
    let camera = earth.camera
    let target = this.controller.target
    if (this.tween) {
        TWEEN.update()
    } else {
        let vector1 = new THREE.Vector3();
        vector1.setFromMatrixColumn(camera.matrix, 0)
        vector1.multiplyScalar(2);
        let vector2 = new THREE.Vector3();
        vector2.setFromMatrixColumn(camera.matrix, 1)
        vector2.multiplyScalar(3.2);
        let position = (new THREE.Vector3).addVectors(vector1, vector2).add(cTarget);
        let locations = earth.earthGroup.children.filter(function (L) {
            return "Sprite" === L.type
        })
        let o = (locations.map(function (L) {
                return L.scale.clone()
            })),
            n = locations.map(function (L) {
                return L.position.clone()
            });
        this.tween = new TWEEN.Tween({
            x: cTarget.x,
            y: cTarget.y,
            z: cTarget.z,
            zoom: camera.zoom,
            spriteScale: 1,
            distanceScale: 1
        }).to({
            x: position.x,
            y: position.y,
            z: position.z,
            zoom: 3,
            spriteScale: .4,
            distanceScale: .94
        }, 1000).easing(TWEEN.Easing.Quadratic.Out).onUpdate(function () {
            let spriteScale = this.spriteScale
            let distanceScale = this.distanceScale
            cTarget.set(this.x, this.y, this.z)
            orbitController.object.zoom = this.zoom
            orbitController.object.updateProjectionMatrix()
            locations.forEach(function (item, index) {
                item.scale.copy(o[index].clone().multiplyScalar(spriteScale))
                item.position.copy(n[index].clone().multiplyScalar(distanceScale))
            })
        }).onComplete(function () {

        }).start()

        let from = earth.earthGroup.rotation
        let to = target.shadowLocation
        that.tween2 = new TWEEN.Tween({
            x: 0,
            y: 0,
            z: 0
        }).to({
            x: to.x,
            y: to.y,
            z: 0,
        }, 1000).easing(TWEEN.Easing.Quadratic.Out).onUpdate(function () {
            earth.earthGroup.rotation.set(this.x, this.y, this.z)
        }).onComplete(function () {
            let Quaternion = new THREE.Quaternion()
            Quaternion.setFromEuler(earth.earthGroup.rotation)

            var box = document.getElementsByClassName('c-earthCover')[0];
            var classVal = box.getAttribute('class');
            if(classVal.indexOf("show") == -1){
                classVal = classVal.concat(" show");
                box.setAttribute("class", classVal );
            }
        }).start()
    }
};

MoveToRightState.prototype.backward = function(){
    let that = this
    let earth = this.controller.earth
    let orbitController = earth.controller
    let cTarget = orbitController.target
    let camera = earth.camera
    let target = this.controller.target
    let rotation = earth.earthGroup.rotation

    if(that.firstBack){
        let locations = earth.earthGroup.children.filter(function (L) {
            return "Sprite" === L.type
        })
        let o = (locations.map(function (L) {
                return L.scale.clone()
            })),
            n = locations.map(function (L) {
                return L.position.clone()
            });
        this.tween = new TWEEN.Tween({
            x: cTarget.x,
            y: cTarget.y,
            z: cTarget.z,
            zoom: camera.zoom,
            spriteScale: 1,
            distanceScale: 1
        }).to({
            x: 0,
            y: 0,
            z: 0,
            zoom: 1,
            spriteScale: 2.5,
            distanceScale: 1 / .94
        }, 1000).easing(TWEEN.Easing.Quadratic.Out).onUpdate(function () {
            let spriteScale = this.spriteScale
            let distanceScale = this.distanceScale
            cTarget.set(this.x, this.y, this.z)
            orbitController.object.zoom = this.zoom
            orbitController.object.updateProjectionMatrix()
            locations.forEach(function (item, index) {
                item.material.opacity = 1
                item.scale.copy(o[index].clone().multiplyScalar(spriteScale))
                item.position.copy(n[index].clone().multiplyScalar(distanceScale))
            })
        }).onComplete(function () {
            that.tween = null
            if(!that.tween2)
                that.moveFlag = false
        }).start()

        this.tween2 = new TWEEN.Tween({
            x: rotation.x,
            y: rotation.y,
            z: rotation.z,
        }).to({
            x: 0,
            y: 0,
            z: 0,
        }, 1000).easing(TWEEN.Easing.Quadratic.Out).onUpdate(function () {
            rotation.set(this.x, this.y, this.z)
        }).onComplete(function () {
            let Quaternion = new THREE.Quaternion()
            that.tween2 = null
            if(!that.tween)
                that.moveFlag = false
        }).start()

        that.firstBack = false
        that.moveFlag = true
    }

    if (this.moveFlag) {
        TWEEN.update()
    }else{
        let box = document.getElementsByClassName('c-earthCover')[0]
        let classVal = box.getAttribute('class')
        classVal = classVal.replace('show', '')
        box.setAttribute('class', classVal)
        that.controller.changeState('idle')
    }
}

/**
 *
 * @param controller
 * @returns {ZoomingState}
 */
function ZoomingState(controller) {
    BaseState.apply(this, arguments);
    this.direction = ''
    this.tween = null
    controller.hideCloud()
    controller.showEarth()
}

ZoomingState.prototype = new BaseState;
ZoomingState.prototype.constructor = ZoomingState;
ZoomingState.prototype._setDirection = function(direction){
    let that = this
    let earth = this.controller.earth
    let target = this.controller.target
    let from = earth.cameraPosition()
    let to = null

    if (this.direction !== direction) {
        if (direction === 'forward') {
            to = {
                x: target.cameraNearPosition[0],
                y: target.cameraNearPosition[1],
                z: target.cameraNearPosition[2]
            }
        } else {
            to = {
                x: target.cameraFarPosition[0],
                y: target.cameraFarPosition[1],
                z: target.cameraFarPosition[2]
            }
        }

        this.direction = direction
        this.tween && this.tween.stop()

        this.tween = new TWEEN.Tween(from).to(to, 1000).onUpdate(function () {
            earth.setCamera(this.x, this.y, this.z)
        }).onComplete(function () {
            that._handleTweenComplete()
        }).start()
    }
}
ZoomingState.prototype._handleTweenComplete = function() {
    if (this.direction === 'forward') {
        this.controller.changeState('diving')
    } else {
        this.controller.changeState('idle')
    }
    this.tween = null
}
ZoomingState.prototype.forward = function () {
    this._setDirection('forward')
    if (this.tween) {
        TWEEN.update()
    }
}
ZoomingState.prototype.backward = function () {
    this._setDirection('backward')
    if (this.tween) {
        TWEEN.update()
    }
}

/**
 *
 * @param controller
 * @returns {DivingState}
 */
function DivingState(controller) {
    BaseState.apply(this, arguments);
    this.count = 0
    controller.showCloud()
    controller.hideEarth()
    controller.hideVideo()
}

DivingState.prototype = new BaseState;
DivingState.prototype._throttle = function(fn) {
    if (this.count % 3 === 0) {
        fn && fn()
        this.count = 0
    }
    this.count++
}
DivingState.prototype.forward = function() {
    let cloud = this.controller.cloud
    if (cloud.currentFrameIndex === cloud.images.length - 1) {
        this.controller.changeState('presenting')
    } else {
        this._throttle(_ => cloud.next())
    }
}
DivingState.prototype.backward = function() {
    let cloud = this.controller.cloud
    if (cloud.currentFrameIndex === 0) {
        this.controller.changeState('zooming')
    } else {
        this._throttle(_ => cloud.prev())
    }
}

/**
 *
 * @param controller
 * @returns {PresentingState}
 */
function PresentingState(controller) {
    BaseState.apply(this, arguments);
    this.count = 0
    controller.hideCloud()
    controller.showVideo()
}

PresentingState.prototype = new BaseState;
PresentingState.prototype.backward = function() {
    this.controller.changeState('diving')
}