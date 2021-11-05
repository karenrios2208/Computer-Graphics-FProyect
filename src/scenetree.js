import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { CubeRefractionMapping, PixelFormat } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

//loading
const textureLoader = new THREE.TextureLoader()
const woodTexture= textureLoader.load('/textures/wood.jpg')
const stoneBase= textureLoader.load('/textures/Stone_Tiles_003_COLOR.jpg')
const stoneDisp=textureLoader.load('/textures/Stone_Tiles_003_DISP.png')
const stoneNorm=textureLoader.load('/textures/Stone_Tiles_003_NORM.jpg')
const stoneRou=textureLoader.load('/textures/Stone_Tiles_003_ROUGH.jpg')

const concreteBaseB=textureLoader.load('/textures/Concrete_Wall_001_basecolor.jpg')
const concreteBaseR=textureLoader.load('/textures/Concrete_Wall_001_basecolorRed.jpg')
const concreteNorm=textureLoader.load('/textures/Concrete_Wall_001_normal.jpg')

const waterNorm=textureLoader.load('/textures/Water_001_NORM.jpg')
const waterBase=textureLoader.load('/textures/Water_001_COLOR.jpg')
const waterDisp=textureLoader.load('/textures/Water_001_DISP.png')
const waterOcc=textureLoader.load('/textures/Water_001_OCC.jpg')
const waterspec=textureLoader.load('/textures/Water_001_SPEC.jpg')

//stone texture obtained from https://3dtextures.me/2018/09/27/stone-tiles-003/
//concrete texture obtained from https://3dtextures.me/2019/05/13/concrete-wall-001/
const xPiso=100
const yPiso=100
stoneBase.wrapS= THREE.RepeatWrapping;
stoneBase.wrapT= THREE.RepeatWrapping;

stoneDisp.wrapS= THREE.RepeatWrapping;
stoneDisp.wrapT= THREE.RepeatWrapping;

stoneNorm.wrapS= THREE.RepeatWrapping;
stoneNorm.wrapT= THREE.RepeatWrapping;

stoneRou.wrapS= THREE.RepeatWrapping;
stoneRou.wrapT= THREE.RepeatWrapping;
//stoneNorm.repeat.set(xPiso,yPiso);
stoneBase.repeat.set(xPiso,yPiso);
stoneRou.repeat.set(xPiso,yPiso);
stoneDisp.repeat.set(xPiso,yPiso);

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//casas y estructuras
const casaDonRamon = new THREE.BoxGeometry( 4, 2, 5 );
const casaBruja = new THREE.BoxGeometry( 5, 2, 5 );
const casaDonaFlo = new THREE.BoxGeometry( 5, 2, 4 );
const baseEscalera = new THREE.BoxGeometry( 4, 2, 4 );
const casaPaty = new THREE.BoxGeometry( 4, 2, 4 );
const entrada = new THREE.BoxGeometry( 6, 4, 9 );
const entrada2 = new THREE.BoxGeometry( 6, 2, 4 );
const entradaTecho = new THREE.BoxGeometry( 6, .5, 4 );
const piso = new THREE.PlaneBufferGeometry(2000, 2000, 8, 8)
const porton =new THREE.PlaneBufferGeometry(4,2)



//objetos 
//const barril = new THREE.CylinderGeometry( .3, .3, .7, 19,7, false, 0, 6.3 );
const fuente = new THREE.CylinderGeometry( .8, .8, .3, 19,7, false, 0, 6.3 );
const pelota = new THREE.SphereGeometry( .2, 15, 16 );


//objetos 
fuente.translate(9,.1,-3)
//barril.translate(-5,.3,-6)
pelota.translate(-4,.2,-6)
//construccion
    //casas
casaDonRamon.translate(4,1,-3)
casaBruja.translate(3.5,1,-10)
casaDonaFlo.translate(-1.5,1,-12)
baseEscalera.translate(-6,1,-12)
casaPaty.translate(-6,3,-12)
    //fachada
entrada.translate(-10,2,-9.5)
entrada2.translate(-10,1,1)
entradaTecho.translate(-10,1.75,-3)
porton.rotateY( - Math.PI / 2);
porton.translate(-13,1,-3)
piso.rotateX( - Math.PI / 2);
piso.translate(0,0,0)




// Materials

const pisoPiedra = new THREE.MeshStandardMaterial({
    map: stoneBase,
    normalMap: stoneNorm,
    roughnessMap: stoneRou,
    //displacementMap:stoneDisp,
    //displacementScale:0,
    roughness:0.4,
    
}
)

const agua = new THREE.MeshStandardMaterial({
    map: waterBase,
    normalMap: waterNorm,
    displacementMap: waterDisp,
    displacementScale:0,
    aoMap: waterOcc, 
    aoMapIntensity:1,
    reflectivity: .5     
}
)


const donRmat= new THREE.MeshStandardMaterial({
    map: concreteBaseB,
    normalMap: concreteNorm,
    roughness:0.4, 
}
)

const flomat= new THREE.MeshStandardMaterial({
    map: concreteBaseR,
    normalMap: concreteNorm,
    roughness:0.4, 
}
)

const paredAmat= new THREE.MeshStandardMaterial({
    color:0xe3a214,
    normalMap: concreteNorm,
    roughness:0.4, 
}
)
const paredAzmat= new THREE.MeshStandardMaterial({
    color:0xa5c6e5,
    normalMap: concreteNorm,
    roughness:0.4, 
}
)
const paredBeimat= new THREE.MeshStandardMaterial({
    color:0xe0daaa,
    normalMap: concreteNorm,
    roughness:0.4, 
}
)


const paredRmat= new THREE.MeshStandardMaterial({
    color:0xd42215,
    normalMap: concreteNorm,
    roughness:0.4, 
}
)
const concreteBlanc = new THREE.MeshBasicMaterial({ 
    color: 0xFFFFFF,
    normalMap: concreteNorm
});

var cubeDonRMat = [
    donRmat,
    donRmat,
    paredAzmat,
    donRmat,
    donRmat,
    donRmat
 ];
 var cubeDonFMat = [
    flomat,
    flomat,
    paredBeimat,
    flomat,
    flomat,
    flomat
 ];

 const fuentemat = [
    concreteBlanc,
    agua,
    concreteBlanc
  ]

const material = new THREE.MeshStandardMaterial()
material.roughness = 0.5
material.normalMap = woodTexture
material.color = new THREE.Color(0x50300c)
const mat = new THREE.MeshBasicMaterial({ color: 0x50300c, side: THREE.DoubleSide });
const portoncc = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });

const materialRamon = new THREE.MeshStandardMaterial()
const materialBruja = new THREE.MeshStandardMaterial()
materialRamon.color = new THREE.Color(0x6fabd1)
materialBruja.color = new THREE.Color(0xe3a214)

// Mesh
//const sphere = new THREE.Mesh(barril,material)
const ronramon = new THREE.Mesh(casaDonRamon,cubeDonRMat)
const bruja71 = new THREE.Mesh(casaBruja,paredAmat)
const DonaFlorinda = new THREE.Mesh(casaDonaFlo,cubeDonFMat)
const EscaleraB = new THREE.Mesh(baseEscalera,paredRmat)
const Paty = new THREE.Mesh(casaPaty,paredAmat)
const plane = new THREE.Mesh(piso, pisoPiedra)
const entradac =new THREE.Mesh(entrada,paredAmat)
const entradab =new THREE.Mesh(entrada2,paredAmat)
const entradat =new THREE.Mesh(entradaTecho,paredAmat)
const eporton =new THREE.Mesh(porton,portoncc)
const lfuente =new THREE.Mesh(fuente,fuentemat)
const pelotak =new THREE.Mesh(pelota,materialRamon)



//scene.add(sphere)
scene.add(ronramon)
scene.add(bruja71)
scene.add(DonaFlorinda)
scene.add(EscaleraB)
scene.add(Paty)
scene.add(plane)
scene.add(entradac)
scene.add(entradab)
scene.add(entradat)
scene.add(eporton)
scene.add(lfuente,pelotak)


//objetos importados 3d
const loader3d = new GLTFLoader()
/*loader3d.load( '/assets/stairs.glb', function ( gltf ) {
    const model = gltf.scene;
    model.scale.set(.03,.03,.03)
    model.position.set(-6.5,0,-8.6);
    model.rotateY( Math.PI / 2)
    model.isDraggable = true;
    scene.add(model);

}, undefined, function ( error ) {

	console.error( error );

} );*/

//Escalera obtenida de 

loader3d.load( '/assets/stairs3.glb', function ( gltf ) {
    const model = gltf.scene;
    model.scale.set(6,7,6)
    model.position.set(-5,1.75,-8.7);
    model.rotateY( -Math.PI/2)
    model.isDraggable = true;
    scene.add(model);

}, undefined, function ( error ) {

	console.error( error );

} );


//triciclo obtenido de paint3D
loader3d.load( '/assets/triciclo.glb', function ( gltf ) {
    const model = gltf.scene;
    model.scale.set(.8,1,1)
    model.position.set(-1,.3,-5.7);
    model.isDraggable = true;
    scene.add(model);

}, undefined, function ( error ) {

	console.error( error );

} );


//Barril obtenido de paint3D
loader3d.load( '/assets/barril.glb', function ( gltf ) {
    const model = gltf.scene;
    model.scale.set(1.5,1.5,1.5)
    model.position.set(-3.8,.5,-6);
    model.isDraggable = true;
    scene.add(model);

}, undefined, function ( error ) {

	console.error( error );

} );

//Puertas obtenidas de paint3D
loader3d.load( '/assets/puerta72.glb', function ( gltf ) {
    const model = gltf.scene;
    model.scale.set(1.5,1.5,1.5)
    model.position.set(2.1,.5,-2.5);
    model.rotateY(-Math.PI/2)
    model.isDraggable = true;
    scene.add(model);

}, undefined, function ( error ) {

	console.error( error );

} );

loader3d.load( '/assets/puerta71.glb', function ( gltf ) {
    const model = gltf.scene;
    model.scale.set(1.5,1.5,1.5)
    model.position.set(1.1,.5,-8);
    model.rotateY(-Math.PI/2)
    model.isDraggable = true;
    scene.add(model);

}, undefined, function ( error ) {

	console.error( error );

} );

loader3d.load( '/assets/puerta14.glb', function ( gltf ) {
    const model = gltf.scene;
    model.scale.set(1.5,1.5,1.5)
    model.position.set(0,.5,-10.1);
    //model.rotateY(-Math.PI/2)
    model.isDraggable = true;
    scene.add(model);

}, undefined, function ( error ) {

	console.error( error );

} );


loader3d.load( '/assets/puerta23.glb', function ( gltf ) {
    const model = gltf.scene;
    model.scale.set(1.5,1.5,1.5)
    model.position.set(-6.1,2.4,-10.1);
    //model.rotateY(-Math.PI/2)
    model.isDraggable = true;
    scene.add(model);

}, undefined, function ( error ) {

	console.error( error );

} );



// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)


const pointLight3 = new THREE.PointLight(0xFFFFFF, 2)
pointLight3.position.set(-25.5,27,10.6)
pointLight3.intensity = 1.4

const pointLight4 = new THREE.PointLight(0xFFFFFF, 2)
pointLight4.position.set(45,11,-55)
pointLight4.rotateY( -Math.PI/2)
pointLight4.intensity = 1.1

const pointLight2 = new THREE.PointLight(0xFFFFFF, 2)
pointLight2.position.set(-24,10,-80)
pointLight2.rotateY( Math.PI/2)
pointLight2.rotateX( Math.PI/2)
pointLight2.intensity = 1.5

//scene.add(pointLight2)
scene.add(pointLight3)
scene.add(pointLight4)


gui.add(pointLight2.position, 'x')
gui.add(pointLight2.position, 'y')
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
    //sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()