/*!
 * Unit Function.
 * 
 * Copyright (c) 2018-2019 xjh.
 * Version: 1.0
 * Company: http://www.chinadci.com
 */

function loadImage (imageURL, onLoaded) {
    var image = new Image()
    image.onload = function () { onLoaded(image) }
    image.crossOrigin = true
    image.src = imageURL
}

function loadImages (images, onLoaded) {
    var results = new Array(images.length)

    images.forEach(function (image, index) {
        if (typeof image === 'string') {
            loadImage(image, function (imageLoaded) {
                results[index] = imageLoaded
                if (results.filter(function (r) { return r }).length === images.length) {
                    onLoaded && onLoaded(results)
                }
            })
        } else {
            results[index] = image
        }
    })
}

function getValidIndex (index, length) {
    if (length < 1) {
        return -1
    }

    if (index >= 0) {
        index %= length
    } else {
        index = (length + index % length) % length
    }
    return index
}

function inherit (prototype, body) {
    return Object.assign(Object.create(prototype), body)
}

function getPosition(coord, r) {
    var t = (90 - coord[0]) * (Math.PI / 180),
        u = (coord[1] + 180) * (Math.PI / 180),
        i = -r * Math.sin(t) * Math.cos(u),
        N = r * Math.sin(t) * Math.sin(u),
        w = r * Math.cos(t);
    return {
        x: 1 * i.toFixed(6),
        y: 1 * w.toFixed(6),
        z: 1 * N.toFixed(6)
    }
}