/*!
 * Loading Progress.
 * 
 * Copyright (c) 2018-2019 xjh.
 * Version: 1.0
 * Company: http://www.chinadci.com
 */

function LoadViewController() {
    console.log(1)
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