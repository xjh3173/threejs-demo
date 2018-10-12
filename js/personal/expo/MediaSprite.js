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
    options || (options = {})
    this.options = {
        media: options.media,
        mediaType: options.mediaType, // video, audio
        sprites: options.sprites || [],
        onReady: options.onReady || null,
        onSpriteEnd: options.onSpriteEnd || null
    }

    this.media = null
    this.sprites = this.options.sprites // array: [[0, 2], [2, 4]]; or object: { s1: [0, 1], s2: [2, 4] }
    this.currentSpriteKey = 0
    this.repeatMode = false

    // this.timeUpdateHandler = this._handleTimeUpdate
    // this.metaDataLoadedHandler = this._handleMetaDataLoaded

    this._init()
}

MediaSprite.prototype = {
    _init:function () {
        this._createMedia()
	},

    _createMedia: function () {
        var media = this.options.media
        var mediaType = this.options.mediaType
        var mediaElement = null

        if (typeof media === 'object') {
            // about HTMLMediaElement readyState: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
            if (media.readyState >= 1) {
                setTimeout(function () { this._handleMetaDataLoaded() }.bind(this), 0)
            }
        } else {
            mediaElement = document.createElement(mediaType)
            mediaElement.preload = 'metadata'
            mediaElement.addEventListener('loadedmetadata', this.metaDataLoadedHandler)
            mediaElement.src = media
            media = mediaElement
        }

        media.autoplay = false
        this.media = media
    },

    _handleTimeUpdate: function () {
        if (this.media.currentTime >= this.spriteRange()[1]) {
            this._handleSpriteEnd()

            if (this.repeatMode) {
                this._play(this.currentSpriteKey)
            } else {
                this.pause()
            }
        }
    },

    _handleMetaDataLoaded: function () {
        this.options.onReady && this.options.onReady()
    },

    _handleSpriteEnd: function () {
        this.media.removeEventListener('timeupdate', this._handleTimeUpdate.bind(this))
        setTimeout(function () { this.options.onSpriteEnd && this.options.onSpriteEnd() }.bind(this), 0)
    },

    _play: function () {
        let spriteKey = arguments[0]
        this.set(spriteKey)
        this.media.addEventListener('timeupdate', this._handleTimeUpdate.bind(this))
        this.media.play()
    },

    spriteRange: function () {
        return this.sprites[arguments.length === 1 ? arguments[0] : this.currentSpriteKey]
    },

    play: function(){
        if (arguments.length === 0) {
            console.error('MediaSprite.play() requires spriteKey as the first argument')
            return
        }

        let spriteKey = arguments[0]
        this.repeatMode = false
        this._play(spriteKey)
	},

    repeat: function() {
        if (arguments.length === 0) {
            console.error('MediaSprite.repeat() requires spriteKey as the first argument')
            return
        }
        let spriteKey = arguments[0]
        this.repeatMode = true
        this._play(spriteKey)
	},

    pause: function () {
        this.media.pause()
    },

    set: function() {
        let spriteKey = arguments[0]
        var range = this.spriteRange(spriteKey)

        if (!range) {
            console.error('MediaSprite error: invalid sprite key', spriteKey)
            return
        }

        this.currentSpriteKey = spriteKey
        this.media.currentTime = range[0]
	}
};
