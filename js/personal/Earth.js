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

    this._init()
}

DCIEarth.prototype = {
    _init:function () {
        this._createRenderer()
        this._createScene()
        this._createCamera()
        this._createLight()
        this._createEarth()
        this._createCloud()
        this._createLocations()
        this._createOutGlow()
        this._createController()

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
        this.locationGroup = new THREE.Group()

        this.scene.add(this.earthGroup)
        this.earthGroup.add(this.locationGroup)
    },

    _createCamera:function () {
        let camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 1000)
        // camera.position.set(0, 0, -28)
        camera.position.set(3.55, 0, -328)
        this.scene.add(camera) // this is required cause there is a light under camera
        this.camera = camera
    },

    _createLight:function () {
        this.scene.add(new THREE.AmbientLight(0x393939, 0.5))
        let spotLight = new THREE.SpotLight(0xffffff, 1.2)
        spotLight.position.set(-26, 11, -11)
        spotLight.angle = 0.2
        spotLight.castShadow = false
        spotLight.penumbra = 0.4
        spotLight.distance = 124
        spotLight.decay = 1
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
                bumpScale: 0.15,
                specularMap: this.loader.load( './img/earth_spec.jpg'),
                specular: new THREE.Color('#909090'),
                shininess: 5,
                transparent: true
            })
        );
        this.earthGroup.add(earth)
    },

    _createCloud:function () {
        let cloud = new THREE.Mesh(
            new THREE.SphereGeometry(5.2, 40, 40),
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
                map: this.loader.load( './img/' + location.imageName + '.png'),
                color: 0xffffff,
                fog: true
            })
            let sprite = new THREE.Sprite(spriteMaterial)
            sprite.position.set(location.position[0], location.position[1], location.position[2])
            sprite.scale.set(1.4, 1.4, 1.4)
            this.locationGroup.add(sprite)
        })
    },

    _createOutGlow:function () {
        this.blurScene = new THREE.Scene()
        this.glowGroup = new THREE.Group()
        let sphere = new THREE.SphereGeometry(5, 40, 40)
        let vertexShader = ['varying vec3 vNormal;', 'void main() {', 'vNormal = normalize( normalMatrix * normal );', 'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );', '}'].join('\n')
        let fragmentShader = ['uniform float c;', 'uniform float p;', 'varying vec3 vNormal;', 'void main() {', 'float intensity = pow( c - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), p );', 'gl_FragColor = vec4( 0.2, 0.58, 0.9, 0.3 ) * intensity;', '}'].join('\n')
        let material = new THREE.ShaderMaterial({
            uniforms: {
                'c': { type: 'f', value: 0.34 },
                'p': { type: 'f', value: 9.17 }
            },
            vertexShader,
            fragmentShader
        })
        let glowSphere = new THREE.Mesh(sphere, material)
        glowSphere.material.side = THREE.BackSide
        glowSphere.material.transparent = false
        glowSphere.scale.x = glowSphere.scale.y = glowSphere.scale.z = 1.3
        this.glowGroup.add(glowSphere)
        sphere = new THREE.SphereGeometry(5, 40, 40)
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
        controller.rotateSpeed = 0.7
        controller.autoRotate = false
        controller.enableZoom = false
        controller.enablePan = false
        controller.enabled = true
        this.controller = controller
    },

    _loop:function () {
        requestAnimationFrame(this._loop.bind(this))
        this._animate()
        this._render()
    },

    _animate:function () {
        let rotationSpeed = this.rotationSpeed
        let cloudSpeed = this.cloudSpeed

        if (this.autoRotate) {
            this.camera.position.x = this.camera.position.x * Math.cos(rotationSpeed) - this.camera.position.z * Math.sin(rotationSpeed)
            this.camera.position.z = this.camera.position.z * Math.cos(rotationSpeed) + this.camera.position.x * Math.sin(rotationSpeed)
        }

        this.cloud.rotation.y += cloudSpeed
        if(TWEEN){
            TWEEN.update()
        }
        this.controller.update()
    },

    _render:function () {
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
