const LOCATIONS = [{
    name: 'namibia',
    coord: [-19.2, 14.11666667], // 19° 12' S, 13° 67' E
    position: [4.6, -1.29, -2.42],
    cameraFarPosition: [-20.03, 13.47, -14.61],
    cameraNearPosition: [-3.54, 2.38, -2.58],
    imageName: 'i_namibia',
    coordSpriteIndex: 4,
    videoSprite: [10.80, 19.10],
    soundSprite: [0, 10.057142857142857],
    backgroundPosition: '0 -76px'
}, {
    name: 'mariana',
    coord: [18.25, 142.81666667], // 17° 75' N, 142° 49' E
    position: [-4.390, 2.660, -2.410],
    cameraFarPosition: [26.46, -6.94, -9.96],
    cameraNearPosition: [4.52, -1.30, -1.63],
    imageName: 'i_mariana',
    coordSpriteIndex: 3,
    videoSprite: [2.80, 8.40],
    soundSprite: [24, 34.10938775510204],
    backgroundPosition: '0 -57px'
}, {
    name: 'greenland',
    coord: [72.16666667, -43], // 71° 70' N, 42° 60' W
    position: [1.880, 5.09, 0.89],
    cameraFarPosition: [7.24, 26.52, 7.06],
    cameraNearPosition: [1.30, 4.66, 1.24],
    imageName: 'i_greenland',
    coordSpriteIndex: 2,
    videoSprite: [40.20, 47.80],
    soundSprite: [48, 58.10938775510204],
    backgroundPosition: '0 -38px'
}, {
    name: 'galapagos',
    coord: [1.33333333, -91.15], // 01° 20' N, 90° 69' W
    position: [0.550, 0.024, 5.39],
    cameraFarPosition: [-0.60, 0.14, 28.21],
    cameraNearPosition: [-0.10, 0.024, 4.99],
    imageName: 'i_galapagos',
    coordSpriteIndex: 1,
    videoSprite: [22.00, 37.43],
    soundSprite: [12, 22.057142857142857],
    backgroundPosition: '0 -19px'
}, {
    name: 'antarctica',
    coord: [-77.96666667, -155.63333333], // 77° 58' S, 155° 38' W
    position: [-1.32, -5.05, 0.98],
    cameraFarPosition: [-7.88, -27.00, 1.87],
    cameraNearPosition: [-1.39, -4.75, 0.33],
    imageName: 'i_antarctica',
    coordSpriteIndex: 0,
    videoSprite: [50.90, 69.00],
    soundSprite: [36, 46.05714285714286],
    backgroundPosition: '0 0'
}]

let meteor = new DCIMeteor(document.getElementById('meteor'));
this.resize();
window.addEventListener('resize', () => {
    this.resize()
})

var videoSprite = new MediaSprite({
    media: document.getElementById('video'), // url, HTMLVideoElement or HTMLAudioElement
    mediaType: 'video', // video or audio
    sprites: getSpriteInfo('videoSprite'), // or an object like: {first: [0, 2], sec: [2, 4], third: [4, 9]}
//        onReady: function () {},  // when media is ready (metadata loaded)
//        onSpriteEnd: function () {} // will be invoked when each sprite play completed
})

var cloudSprite = new ImageSprite(document.getElementById('cloud'), {
    interval: 80,
    width: 375,
    height: 600,
    images: getCloudImages()
})

function initEarth(){
    var audioSprite = new MediaSprite({
        media: document.getElementById('audio'),
        mediaType: 'audio',
        sprites: getSpriteInfo('soundSprite'),
//        onReady () {},
        onSpriteEnd: function(){ handleAudioSpriteEnd() }
    })
    let earth = new DCIEarth(document.getElementById('earth'));
    let showXplanButton = false;
    let revealed = false;
    let controller = new EarthController({
        earth: earth,
        cloud: cloudSprite,
        audioSprite: audioSprite,
        videoSprite: videoSprite,
        onTargetChange () {
            showCoord = false
        },
        onStateChange (stateName) {
            if (stateName === 'idle') {
                showXplanButton = true
            } else {
                showXplanButton = false
            }
            if (stateName === 'presenting') {
                revealed = true
            }
            if(showXplanButton && revealed){
                var box = document.getElementsByClassName('c-actions__xplan')[0];
                var classVal = box.getAttribute('class');
                if(classVal.indexOf("show") == -1){
                    classVal = classVal.concat(" show");
                    box.setAttribute("class", classVal );
                }
            }else{
                var box = document.getElementsByClassName('c-actions__xplan')[0];
                if (box.className.match(new RegExp("(\\s|^)" + "show" + "(\\s|$)"))) {
                    var reg = new RegExp("(\\s|^)" + "show" + "(\\s|$)");
                    box.className = box.className.replace(reg, " ");
                }
            }
        }
    })
    setTimeout(_ => {
        controller.nextTarget()
        document.documentElement.addEventListener('touchmove', touchmove);
        document.documentElement.addEventListener('click', touchmove);
    }, 1000)

    function touchmove(e){
        e.preventDefault();
        var box = document.getElementsByClassName('c-earthCover__tips')[0];
        var classVal = box.getAttribute('class');
        classVal = classVal.concat(" hide");
        box.setAttribute("class", classVal );

        box = document.getElementsByClassName('c-actions__longPressText')[0];
        classVal = box.getAttribute('class');
        classVal = classVal.concat(" is-active");
        box.setAttribute("class", classVal );

        box = document.getElementsByClassName('c-actions__longPress')[0];
        classVal = box.getAttribute('class');
        classVal = classVal.concat(" is-active");
        box.setAttribute("class", classVal );
        document.documentElement.removeEventListener("touchmove", touchmove);
        document.documentElement.removeEventListener("click", touchmove);

        document.getElementById('longPress_btn').addEventListener('touchstart', handleHold);
        document.getElementById('longPress_btn').addEventListener('touchcancel', handleHoldEnd);
        document.getElementById('longPress_btn').addEventListener('touchend', handleHoldEnd);

        document.getElementById('longPress_btn').addEventListener('mousedown', handleHold);
        document.getElementById('longPress_btn').addEventListener('mouseup', handleHoldEnd);
    }

    function handleHold(e) {
        e.preventDefault();
        controller.start()
    }

    function handleHoldEnd(e) {
        e.preventDefault();
        controller.end()
    }

    function handleAudioSpriteEnd() {
        controller.nextTarget()
    }
}

function getCloudImages () {
    return new Array(13).fill('').map((item, index) => {
        let num = "" + index;
        while (num.length < 5) {
            num = '0' + num;
        }
        return './img/kf_cloud_' + num + '.jpg';
    })
}

function getSpriteInfo (key) {
    let spriteInfo = {}
    LOCATIONS.forEach(location => {
        spriteInfo[location.name] = location[key]
    })
    return spriteInfo
}

function resize(){
    let ratio = new CenterIt({
        containerWidth: window.innerWidth,
        containerHeight: window.innerHeight,
        originWidth: 375,
        originHeight: 600,
        centerType: 'contain'
    }).ratio();
    var $wraper = document.getElementsByClassName('c-page__wrapper');
    for(var i = 0;i<$wraper.length;i++){
        $wraper[i].style.transform = `scale(${ratio})`;
    }
}