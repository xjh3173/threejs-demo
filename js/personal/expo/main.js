// const LOCATIONS = [{
//     name: 'namibia',
//     coord: [-19.2, 14.11666667], // 19° 12' S, 13° 67' E
//     position: [4.6, -1.29, -2.42],
//     // cameraFarPosition: [-20.03, 13.47, -14.61],
//     cameraFarPosition: [26.46, -6.94, -9.96],
//     cameraNearPosition: [-3.54, 2.38, -2.58],
//     imageName: 'i_namibia',
//     coordSpriteIndex: 4,
//     videoSprite: [10.80, 19.10],
//     soundSprite: [0, 10.057142857142857],
//     backgroundPosition: '0 -76px'
// }, {
//     name: 'mariana',
//     coord: [18.25, 142.81666667], // 17° 75' N, 142° 49' E
//     position: [-4.390, 2.660, -2.410],
//     // cameraFarPosition: [26.46, -6.94, -9.96],
//     cameraFarPosition: [-20.03, 13.47, -14.61],
//     cameraNearPosition: [4.52, -1.30, -1.63],
//     imageName: 'i_mariana',
//     coordSpriteIndex: 3,
//     videoSprite: [2.80, 8.40],
//     soundSprite: [24, 34.10938775510204],
//     backgroundPosition: '0 -57px'
// }, {
//     name: 'greenland',
//     coord: [72.16666667, -43], // 71° 70' N, 42° 60' W
//     position: [1.880, 5.09, 0.89],
//     cameraFarPosition: [7.24, 26.52, 7.06],
//     cameraNearPosition: [1.30, 4.66, 1.24],
//     imageName: 'i_greenland',
//     coordSpriteIndex: 2,
//     videoSprite: [40.20, 47.80],
//     soundSprite: [48, 58.10938775510204],
//     backgroundPosition: '0 -38px'
// }, {
//     name: 'antarctica',
//     coord: [-77.96666667, -155.63333333], // 77° 58' S, 155° 38' W
//     position: [-1.32, -5.05, 0.98],
//     cameraFarPosition: [-7.88, -27.00, 1.87],
//     cameraNearPosition: [-1.39, -4.75, 0.33],
//     imageName: 'i_antarctica',
//     coordSpriteIndex: 0,
//     videoSprite: [50.90, 69.00],
//     soundSprite: [36, 46.05714285714286],
//     backgroundPosition: '0 0'
// }]

const LOCATIONS = [{
    name: 'Beijing',
    coord: [39.9046900000, 116.4071700000], // 19° 12' S, 13° 67' E
    position: [4.6, -1.29, -2.42],
    // cameraFarPosition: [-20.03, 13.47, -14.61],
    cameraFarPosition: [26.46, -6.94, -9.96],
    cameraNearPosition: [-3.54, 2.38, -2.58],
    imageName: 'i_beijing',
    coordSpriteIndex: 4,
    videoSprite: [10.80, 19.10],
    soundSprite: [0, 10.057142857142857],
    backgroundPosition: '0 -76px',
    shadowLocation: {
        x: .85,
        y: 0
    }
}, {
    name: 'Tokyo',
    coord: [35.806006, 139.662476], // 17° 75' N, 142° 49' E
    position: [-4.390, 2.660, -2.410],
    // cameraFarPosition: [26.46, -6.94, -9.96],
    cameraFarPosition: [-20.03, 13.47, -14.61],
    cameraNearPosition: [4.52, -1.30, -1.63],
    imageName: 'i_tokyo',
    coordSpriteIndex: 3,
    videoSprite: [2.80, 8.40],
    soundSprite: [24, 34.10938775510204],
    backgroundPosition: '0 -57px',
    shadowLocation: {
        x: 1.04,
        y: -.39
    }
}, {
    name: 'Paris',
    coord: [48.885774, 2.36345], // 71° 70' N, 42° 60' W
    position: [1.880, 5.09, 0.89],
    cameraFarPosition: [7.24, 26.52, 7.06],
    cameraNearPosition: [1.30, 4.66, 1.24],
    imageName: 'i_paris',
    coordSpriteIndex: 2,
    videoSprite: [40.20, 47.80],
    soundSprite: [48, 58.10938775510204],
    backgroundPosition: '0 -38px',
    shadowLocation: {
        x: -1.06,
        y: -1.53
    }
}, {
    name: 'Los Angeles',
    coord: [34.109669, -118.286023], // 77° 58' S, 155° 38' W
    position: [-1.32, -5.05, 0.98],
    cameraFarPosition: [-7.88, -27.00, 1.87],
    cameraNearPosition: [-1.39, -4.75, 0.33],
    imageName: 'i_losAngeles',
    coordSpriteIndex: 0,
    videoSprite: [50.90, 69.00],
    soundSprite: [36, 46.05714285714286],
    backgroundPosition: '0 0',
    shadowLocation: {
        x: -.59,
        y: .72
    }
}]

var params = {
    a: 1.4,
    b: 2.6,
    c: 2.2,
};

this.resize();
// initGui();
window.addEventListener('resize', () => {
    this.resize()
})

function initEarth(){
    let earth = new DCIEarth(document.getElementById('earth'));
    let controller = new EarthController({
        earth: earth,
        onTargetChange () {
            showCoord = false
        },
        onStateChange (stateName) {
            if (stateName === 'idle') {
                var box = document.getElementsByTagName('body')[0];
                // box.style.background = '#0c0604 url(./img/expo/earth_space.jpg) no-repeat center';
                // showXplanButton = true
            } else {
                // showXplanButton = false
            }
        }
    })

    setTimeout(_ => {
        document.documentElement.addEventListener('click', touched);
        document.documentElement.addEventListener('touchdown', touched);
        document.documentElement.addEventListener('mousedowns', touched);
        var box = document.getElementsByClassName('c-backToOrigin')[0];
        box.addEventListener('click', _ => { controller.end(controller) });
    }, 1000)

    // let raycaster = new THREE.Raycaster();//光线投射，用于确定鼠标点击位置
    // let mouse = new THREE.Vector2();//创建二维平面
    // let mouse = new THREE.Vector2(2 * L.offsetX / t.width * 2 - 1, -2 * L.offsetY / t.height * 2 + 1);//创建二维平面
    // 点击方法
    function touched(e){
        let raycaster = new THREE.Raycaster();//光线投射，用于确定鼠标点击位置
        //将html坐标系转化为webgl坐标系，并确定鼠标点击位置
        let mouse = new THREE.Vector2(2 * e.offsetX / earth.width * 2 - 1, -2 * e.offsetY / earth.height * 2 + 1);
        // mouse.x = e.clientX / earth.renderer.domElement.clientWidth*2-1;
        // mouse.y = -(e.clientY / earth.renderer.domElement.clientHeight*2)+1;
        // 以camera为z坐标，确定所点击物体的3D空间位置
        raycaster.setFromCamera(mouse, earth.camera);
        // 确定所点击位置上的物体数量
        var intersects = raycaster.intersectObjects(earth.earthGroup.children);
        // 选中后进行的操作
        if(intersects.length > 0 && "Sprite" === intersects[0].object.type){
            controller.start(intersects[0].object);
        }
    }

}

function initGui(){
    gui = new dat.GUI();
    gui.add( params, "a", -10, 10);
    gui.add( params, "b", -10, 10);
    gui.add( params, "c", -10, 10);
    gui.open();
}

function resize(){
    let ratio = new CenterIt({
        containerWidth: window.innerWidth,
        containerHeight: window.innerHeight,
        originWidth: 375,
        originHeight: 600,
        centerType: 'cover'
    }).ratio();
    var $wraper = document.getElementsByClassName('c-page__wrapper');
    for(var i = 0;i<$wraper.length;i++){
        $wraper[i].style.transform = `scale(${ratio})`;
    }
}