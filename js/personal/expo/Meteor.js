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
const RANGE_TOTAL_STARS = [40, 50];
const RANGE_STAR_RADIUS = [1, 2];

function DCIMeteor(el) {
    this.el = el
    this.meteorImage = null
    this.width = window.innerWidth * 2
    this.height = window.innerHeight * 2
    this.context = null

    this.stars = []
    this.meteor = null
	this.count = 0;

    this._init()
}

DCIMeteor.prototype = {
	_init: function() {
        this._loadImage()
        this._createCanvas()

        this._createStars()
        this._drawStars()

        this._createMeteor()
        this._drawMeteor()

        this._loop()
	},

    _loop: function () {
        this.count++;
        if (this.stars.length > 0) {
            this.count % 10 === 0 && this._drawStars();
        }
        if (this.meteor && this.meteorImage) {
			if (this._flowMeteor()) {
				this.context.clearRect(this.meteor.x, this.meteor.y, 166, 130);
                this._createMeteor()
                this._drawMeteor()
			} else {
                this._moveMeteor()
			}
        }
        requestAnimationFrame(this._loop.bind(this))
    },

    _loadImage: function () {
        let image = new Image()
        image.src = './img/bg_meteor.png'
        this.meteorImage = image
    },

    _createCanvas: function () {
        let canvas = document.createElement('canvas')
        canvas.width = this.width
        canvas.height = this.height
        canvas.style.width = this.width / 2 + 'px'
        canvas.style.height = this.height / 2 + 'px'

        this.el.appendChild(canvas)
        this.context = canvas.getContext('2d')
    },

    _createStars: function () {
        let total = this._random(RANGE_TOTAL_STARS[0], RANGE_TOTAL_STARS[1])
        let width = this.width
        let height = this.height

        for (let i = 0; i < total; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                r: Math.random() + 1,
            })
        }
    },

    _clear: function () {
        this.context.clearRect(0, 0, this.width, this.height)
    },

    _drawStars: function () {
        let context = this.context
        context.save();
        this.stars.forEach(star => {
            context.fillStyle = this._getColor();
            context.beginPath();
            context.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
            context.fill();
        })
        context.restore();
    },

	_getColor: function(){
        let n = Math.random();
        let color = void 0;
        if (n < 0.5) {
            color = '#d6edff';
        } else {
            color = '#858bc5';
        }
        return color;
	},

    _createMeteor: function() {
        // setTimeout(() => {
            // let startX = Math.random() * this.width
            // let startY = Math.random() * this.height / 2

            let startX = this._random(this.width * 0.5, this.width * 1.5)
            let startY = this._random(this.height * -0.5, this.height * 0.5)

            this.meteor = {
                x: startX,
                y: startY,
                // fromX: startX,
                // fromY: startY,
                // toX: this.width * -0.1,
                // toY: this.height * 1.1,
                speed: Math.floor(Math.random() * 5 + 2)
            }
        // }, this._random(0, 1))
	},

    _drawMeteor: function () {
        let context = this.context
        context.save();
        if (this.meteorImage.complete) {
            context.drawImage(this.meteorImage, this.meteor.x, this.meteor.y)
        }
        context.restore();
    },

    _moveMeteor: function() {
        this.context.clearRect(this.meteor.x, this.meteor.y, 166, 130);
        this.meteor.x -= this.meteor.speed;
        this.meteor.y += this.meteor.speed;
        this._drawMeteor();
	},

	_flowMeteor: function() {
        if (this.meteor.y > this.height) {
            return true;
        } else {
            return false;
        }
	},

    _random: function (Min, Max){
		var Range = Max - Min;
		var Rand = Math.random();
		var num = Min + Math.round(Rand * Range); //四舍五入
		return num;
	}
};
