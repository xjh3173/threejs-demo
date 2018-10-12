(function (root, factory) {
  'use strict'
  /* istanbul ignore next */
  if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory()
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory)
  } else {
    // Browser globals
    root.MediaSprite = factory()
  }
})(this, function () {

  function MediaSprite (options) {
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

    this.timeUpdateHandler = this._handleTimeUpdate
    this.metaDataLoadedHandler = this._handleMetaDataLoaded

    this._init()
  }

  MediaSprite.prototype._init = function () {
    this._createMedia()
  }

  MediaSprite.prototype._createMedia = function () {
    var media = this.options.media
    var mediaType = this.options.mediaType
    var mediaElement = null

    if (typeof media === 'object') {
      // about HTMLMediaElement readyState: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
      if (media.readyState >= 1) {
        setTimeout(function () { this.metaDataLoadedHandler() }.bind(this), 0)
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
  }

  MediaSprite.prototype._handleTimeUpdate = function () {
    if (this.media.currentTime >= this.spriteRange()[1]) {
      this._handleSpriteEnd()

      if (this.repeatMode) {
        this._play(this.currentSpriteKey)
      } else {
        this.pause()
      }
    }
  }

  MediaSprite.prototype._handleMetaDataLoaded = function () {
    this.options.onReady && this.options.onReady()
  }

  MediaSprite.prototype._handleSpriteEnd = function () {
    this.media.removeEventListener('timeupdate', this.timeUpdateHandler)
    setTimeout(function () { this.options.onSpriteEnd && this.options.onSpriteEnd() }.bind(this), 0)
  }

  MediaSprite.prototype._play = function (spriteKey) {
    this.set(spriteKey)
    this.media.addEventListener('timeupdate', this.timeUpdateHandler)
    this.media.play()
  }

  MediaSprite.prototype.spriteRange = function (spriteKey) {
    return this.sprites[arguments.length === 1 ? spriteKey : this.currentSpriteKey]
  }

  MediaSprite.prototype.play = function (spriteKey) {
    if (arguments.length === 0) {
      console.error('MediaSprite.play() requires spriteKey as the first argument')
      return
    }

    this.repeatMode = false
    this._play(spriteKey)
  }

  MediaSprite.prototype.repeat = function (spriteKey) {
    if (arguments.length === 0) {
      console.error('MediaSprite.repeat() requires spriteKey as the first argument')
      return
    }

    this.repeatMode = true
    this._play(spriteKey)
  }

  MediaSprite.prototype.pause = function () {
    this.media.pause()
  }

  MediaSprite.prototype.set = function (spriteKey) {
    var range = this.spriteRange(spriteKey)

    if (!range) {
      console.error('MediaSprite error: invalid sprite key', spriteKey)
      return
    }

    this.currentSpriteKey = spriteKey
    this.media.currentTime = range[0]
  }

  return MediaSprite
})