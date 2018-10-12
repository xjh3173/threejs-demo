/*!
 * Create Earth.
 * 
 * Copyright (c) 2018-2019 xjh.
 * Version: 1.0
 * Company: http://www.chinadci.com
 */

/**
 *
 * @param element
 * @returns {Earth}
 */

function DCIEarth(el) {
    this.container = typeof el === 'string' ? document.getElementById(el) : el

    this.width = 375 * 2
    this.height = 600 * 2
    this.camera = null
    this.renderer = null
    this.controller = null

    this.scene = null
    this.earthGroup = null
    this.locationGroup = null
    this.cloud = null
    this.hasGlow = false
    this.loader = false

    this.autoRotate = true
    this.rotationSpeed = 0.001
    this.cloudSpeed = -0.0003

    this.orbitController = null
    this.glowReady = !1
    this.pointer = null
    this.raycaster = new THREE.Raycaster
    this.animateControl = null
    this.enableClick = !0

    // let t = this
    // this.onPointerDown = function (L) {
    //     this.enableClick && (t.pointer = new f.Vector2(2 * L.offsetX / t.width * 2 - 1, -2 * L.offsetY / t.height * 2 + 1))
    // }

    this._init()
}

DCIEarth.prototype = {
    _init:function () {
        this._createRenderer()
        this._createScene()
        this._createCamera()
        this._createLight()
        this._createEarth()
        this._createDome()
        this._createCloud()
        this._createLocations()
        this._createOutGlow()
        this._createController()
        // this._bindEvent()

        this._loop()
    },

    _createRenderer:function () {
        let renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true
        })
        let container = this.container

        renderer.setClearColor(0x000000, 0)
        // renderer.setPixelRatio(window.devicePixelRatio) // this line would make FPS decreased at 30 for mobile device
        renderer.setSize(this.width, this.height)
        renderer.domElement.style.position = 'relative'
        renderer.domElement.style.width = this.width / 2 + 'px'
        renderer.domElement.style.height = this.height / 2 + 'px'
        container.appendChild(renderer.domElement)
        this.renderer = renderer
    },

    _createScene:function () {
        this.scene = new THREE.Scene()
        this.earthGroup = new THREE.Group()
        // this.locationGroup = new THREE.Group()

        this.scene.add(this.earthGroup)
        // this.earthGroup.add(this.locationGroup)
    },

    _createCamera:function () {
        let camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 1000)
        // camera.position.set(0, 0, -28)
        // camera.position.set(3.55, 0, -328)
        camera.position.set(0, 0, 400)
        this.scene.add(camera) // this is required cause there is a light under camera
        this.camera = camera
        // camera.setViewOffset(830, 1334, 0, 140, 830, 1334)
    },

    _createLight:function () {
        this.scene.add(new THREE.AmbientLight(0x393939, 0.5))
        let spotLight = new THREE.SpotLight(0xffffff, 1.2)
        // spotLight.position.set(-26, 11, -11)
        spotLight.position.set(20, 20, 3)
        spotLight.angle = 0.2
        spotLight.castShadow = false
        // spotLight.penumbra = 0.4
        spotLight.penumbra = 0
        spotLight.distance = 124
        spotLight.decay = 1
        spotLight.intensity = 1.3
        spotLight.shadow.camera.near = 50
        spotLight.shadow.camera.far = 200
        spotLight.shadow.camera.fov = 35
        spotLight.shadow.mapSize.height = 1024
        spotLight.shadow.mapSize.width = 1024
        this.camera.add(spotLight)  // fixed light direction by adding it as child of camera
    },

    _createEarth:function () {
        this.loader = new THREE.TextureLoader()
        this.loader.crossOrigin = ''
        let earth = new THREE.Mesh(
            new THREE.SphereGeometry(5, 32, 32),
            new THREE.MeshPhongMaterial({
                map: this.loader.load( './img/earth4.jpg'),
                bumpMap: this.loader.load( './img/earth_bump.jpg'),
                bumpScale: 0.25,
                specularMap: this.loader.load( './img/earth_spec.jpg'),
                specular: new THREE.Color('#909090'),
                shininess: 7,
                transparent: true
            })
        );
        earth.name = "earth"
        this.earthGroup.add(earth)
    },

    _createDome:function () {
        // let L, demo = ((L = new THREE.MeshBasicMaterial({
        //     map: this.loader.load( './img/expo/earth_space.jpg'),
        //     emissive: 0,
        //     transparent: !0
        // })).side = THREE.BackSide, L.opacity = 1, new THREE.Mesh(new THREE.SphereGeometry(30, 32, 32), L))

        let L = new THREE.MeshBasicMaterial({
            map: this.loader.load( './img/expo/earth_space.jpg'),
            emissive: 0,
            transparent: !0
        });
        L.side = THREE.BackSide
        L.opacity = 0
        let demo = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 32), L)

        demo.name = "dome"
        this.earthGroup.add(demo)
    },

    _createCloud:function () {
        let cloud = new THREE.Mesh(
            new THREE.SphereGeometry(5.1, 32, 32),
            new THREE.MeshPhongMaterial({
                map: this.loader.load( './img/earth_cloud.png'),
                transparent: true,
                opacity: 1,
                blending: THREE.AdditiveBlending
            })
        );
        this.earthGroup.add(cloud)
        this.cloud = cloud
    },

    _createLocations:function () {
        LOCATIONS.forEach(location => {
            let spriteMaterial = new THREE.SpriteMaterial({
                map: this.loader.load( './img/expo/' + location.imageName + '.svg'),
                // map: this.loader.load( './img/' + location.imageName + '.png'),
                color: 0xffffff,
                fog: true
            })
            let sprite = new THREE.Sprite(spriteMaterial)
            let position = getPosition(location.coord, 5.7)
            sprite.name = location.imageName
            sprite.center.set(.4, .5)
            sprite.position.set(position.x, position.y, position.z)
            // sprite.scale.set(3, 1, 1.4)
            sprite.scale.set(2.7, .85, .85)
            // sprite.position.set(location.position[0], location.position[1], location.position[2])
            // sprite.scale.set(1.4, 1.4, 1.4)
            sprite.userData = {target: location}
            this.earthGroup.add(sprite)
        })
    },

    _createOutGlow:function () {
        this.blurScene = new THREE.Scene()
        this.glowGroup = new THREE.Group()
        let sphere = new THREE.SphereGeometry(5, 32, 32)
        let vertexShader = ['varying vec3 vNormal;', 'void main() {', 'vNormal = normalize( normalMatrix * normal );', 'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );', '}'].join('\n')
        let fragmentShader = ['uniform float c;', 'uniform float p;', 'varying vec3 vNormal;', 'void main() {', 'float intensity = pow( c - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), p );', 'gl_FragColor = vec4( 0.2, 0.58, 0.9, 0.3 ) * intensity;', '}'].join('\n')
        let material = new THREE.ShaderMaterial({
            uniforms: {
                'c': { type: 'f', value: 0.34 },
                'p': { type: 'f', value: 9.17 }
            },
            vertexShader,
            fragmentShader,
            side: THREE.BackSide,
            transparent: false
        })
        let glowSphere = new THREE.Mesh(sphere, material)
        glowSphere.material.side = THREE.BackSide
        glowSphere.material.transparent = false
        glowSphere.scale.x = glowSphere.scale.y = glowSphere.scale.z = 1.4
        this.glowGroup.add(glowSphere)
        sphere = new THREE.SphereGeometry(5, 32, 32)
        let blackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
        let blackSphere = new THREE.Mesh(sphere, blackMaterial)
        blackSphere.material.transparent = false
        this.glowGroup.add(blackSphere)
        this.blurScene.add(this.glowGroup)

        let blurRenderTarget = new THREE.WebGLRenderTarget(this.width, this.height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            stencilBuffer: true
        })

        let blurRenderPass = new THREE.RenderPass(this.blurScene, this.camera)
        let sceneRenderPass = new THREE.RenderPass(this.scene, this.camera)

        this.blurComposer = new THREE.EffectComposer(this.renderer, blurRenderTarget)
        this.blurComposer.addPass(blurRenderPass)
        this.sceneComposer = new THREE.EffectComposer(this.renderer, blurRenderTarget)
        this.sceneComposer.addPass(sceneRenderPass)

        let AdditiveBlendShader = {
            uniforms: {
                'tSampler1': { type: 't', value: null },
                'tSampler2': { type: 't', value: null }
            },
            vertexShader: ['varying vec2 vUv;', 'void main() {', 'vUv = uv;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );', '}'].join('\n'),
            fragmentShader: ['uniform sampler2D tSampler1;', 'uniform sampler2D tSampler2;', 'varying vec2 vUv;', 'void main() {', 'vec4 texture1 = texture2D( tSampler1, vUv );', 'vec4 texture2 = texture2D( tSampler2, vUv );', 'gl_FragColor = texture1 + texture2;', '}'].join('\n')
        }
        let effectBlend = new THREE.ShaderPass(AdditiveBlendShader, 'tSampler1')
        effectBlend.uniforms['tSampler2'].value = this.blurComposer.renderTarget2.texture
        effectBlend.renderToScreen = true

        this.sceneComposer.addPass(effectBlend)
        this.hasGlow = true
    },

    _createController:function () {
        let controller = new THREE.OrbitControls(this.camera)
        controller.rotateSpeed = .2
        controller.autoRotateSpeed = .1
        controller.autoRotate = true
        controller.enableZoom = false
        controller.enablePan = false
        controller.enableDamping = true
        controller.dampingFactor = .21
        controller.enabled = true
        this.controller = controller
    },

    _bindEvent: function(){
        let t = this
        window.addEventListener("mousedowns", t.onPointerDown, !1)
        window.addEventListener("touchdown", t.onPointerDown, !1)
        window.addEventListener("click", t.onPointerDown, !1)
    },

    _loop:function () {
        requestAnimationFrame(this._loop.bind(this))
        this._animate()
        this._render()
    },

    _animate:function () {
        // this.locationGroup.children.map(item => {
        //     item.scale.set(params.a, params.b, params.c)
        // })
        let rotationSpeed = this.rotationSpeed
        let cloudSpeed = this.cloudSpeed

        // if (this.autoRotate) {
        //     this.camera.position.x = this.camera.position.x * Math.cos(rotationSpeed) - this.camera.position.z * Math.sin(rotationSpeed)
        //     this.camera.position.z = this.camera.position.z * Math.cos(rotationSpeed) + this.camera.position.x * Math.sin(rotationSpeed)
        // }

        this.cloud.rotation.y += cloudSpeed
        // if(TWEEN){
        //     TWEEN.update()
        // }
        this.controller.update()

        // this.clouds.length > 0 && (this.clouds[0].rotation.y += this.cloudSpeed)
        // this.orbitController && this.orbitController.update()
    },

    _render:function () {
        // if (this.pointer) {
        //     this.raycaster.setFromCamera(this.pointer, this.camera);
        //     var L = this.raycaster.intersectObjects(this.earthGroup.children);
        //     L[0] && "Sprite" === L[0].object.type && this.animateControl.toCity(L[0].object.name), this.pointer = null
        // }

        if (this.isStart && this.hasGlow) {
            this.blurComposer.render()
            this.sceneComposer.render()
        } else {
            this.renderer.render(this.scene, this.camera)
            this.isStart = true
        }
    },

    setCamera:function () {
        if (arguments.length === 3) {
            this.camera.position.set(arguments[0], arguments[1], arguments[2])
        } else {
            this.camera.position.set(arguments.x, arguments.y, arguments.z)
        }
    },

    cameraPosition:function () {
        return {
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z
        }
    },

    startAutoRotate:function () {
        this.autoRotate = true
    },

    stopAutoRotate:function () {
        this.autoRotate = false
    }
};