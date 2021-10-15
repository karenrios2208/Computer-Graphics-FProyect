import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { CubeRefractionMapping } from 'three'

//loading
const textureLoader = new THREE.TextureLoader()
const woodTexture  = textureLoader.load('/textures/wood.jpg')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const barril = new THREE.CylinderGeometry( .2, .2, .5, 19,7, false, 0, 6.3 );
const casaDonRamon = new THREE.BoxGeometry( 4, 2, 5 );
const casaBruja = new THREE.BoxGeometry( 5, 2, 5 );
const casaDonaFlo = new THREE.BoxGeometry( 5, 2, 4 );
const baseEscalera = new THREE.BoxGeometry( 2, 2, 4 );
const casaPaty = new THREE.BoxGeometry( 2, 2, 4 );

const piso = new THREE.PlaneBufferGeometry(2000, 2000, 8, 8)
casaDonRamon.translate(4,1,-3)
casaBruja.translate(3.5,1,-10)
casaDonaFlo.translate(-1.5,1,-12)
baseEscalera.translate(-5,1,-12)
casaPaty.translate(-5,3,-12)
barril.translate(0,.3,0)
piso.rotateX( - Math.PI / 2);
piso.translate(0,0,0)

// Materials

const material = new THREE.MeshStandardMaterial()
material.roughness = 0.5
material.normalMap = woodTexture
material.color = new THREE.Color(0x50300c)
const mat = new THREE.MeshBasicMaterial({ color: 0x50300c, side: THREE.DoubleSide });

const materialRamon = new THREE.MeshStandardMaterial()
const materialBruja = new THREE.MeshStandardMaterial()
materialRamon.color = new THREE.Color(0x6fabd1)
materialBruja.color = new THREE.Color(0xe3a214)

// Mesh
const sphere = new THREE.Mesh(barril,material)
const ronramon = new THREE.Mesh(casaDonRamon,materialRamon)
const bruja71 = new THREE.Mesh(casaBruja,materialBruja)
const DonaFlorinda = new THREE.Mesh(casaDonaFlo,materialRamon)
const EscaleraB = new THREE.Mesh(baseEscalera,materialBruja)
const Paty = new THREE.Mesh(casaPaty,materialRamon)
const plane = new THREE.Mesh(piso, mat)
scene.add(sphere)
scene.add(ronramon)
scene.add(bruja71)
scene.add(DonaFlorinda)
scene.add(EscaleraB)
scene.add(Paty)
scene.add(plane)
//ronramon.position(0,0,0)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)


const pointLight2 = new THREE.PointLight(0xFFFFFF, 2)
pointLight2.position.set(0,0.4,1.3)
pointLight2.intensity = 1.7

scene.add(pointLight2)

gui.add(pointLight2.position, 'y')
gui.add(pointLight2.position, 'x')
gui.add(pointLight2.position, 'z')
gui.add(pointLight2, 'intensity')

const pointLightHelper = new THREE.PointLightHelper(pointLight2, .2)
scene.add(pointLightHelper)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
//camera.up.set(0,-1,0)

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//helper de la camara

gui.add(camera.position, 'y')
gui.add(camera.position, 'x')
gui.add(camera.position, 'z')

//gui.add(pointLight2, 'intensity')
const helper = new THREE.CameraHelper( camera );
scene.add( helper );

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha : true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()