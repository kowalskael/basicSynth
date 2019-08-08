import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import obj from './assets/elsynth_1.gltf';

var targetRotation = 0;
var targetRotationOnMouseDown = 0;
var mouseX = 0;
var mouseXOnMouseDown = 0;
var windowHalfX = window.innerWidth / 2;

const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});

const camera = new THREE.PerspectiveCamera(10, 2, 0.1, 1000);
camera.position.set(0, 0, 200);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const spotLight = new THREE.SpotLight( 0xb5b5b5);
spotLight.position.set( 0, 200, 150 );
spotLight.penumbra = 2;
scene.add(spotLight);

function dumpObject(obj, lines = [], isLast = true, prefix = '') {
  const localPrefix = isLast ? '└─' : '├─';
  lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
  const newPrefix = prefix + (isLast ? '  ' : '│ ');
  const lastNdx = obj.children.length - 1;
  obj.children.forEach((child, ndx) => {
    const isLast = ndx === lastNdx;
    dumpObject(child, lines, isLast, newPrefix);
  });
  return lines;
}

const loadModel = new THREE.Object3D();
scene.add(loadModel);

const loader = new GLTFLoader();

<<<<<<< HEAD
let objects = [];

=======
>>>>>>> fa75af106debc80026bfaa9a2f73f986f55df600
let attack;
let release;

const mesh = new THREE.Object3D();
loader.load(obj, gltf => {
  mesh.add(gltf.scene);
  loadModel.add(mesh);
<<<<<<< HEAD

=======
>>>>>>> fa75af106debc80026bfaa9a2f73f986f55df600
  attack = mesh.getObjectByName('ENV_Atack');
  release = mesh.getObjectByName('ENV_Release');
  objects.push(attack);
  objects.push(release);
});

<<<<<<< HEAD
mesh.rotation.x = 0.7;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseMove( event ) {
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

const render = () => {

  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( objects, true );
  for ( var i = 0; i < intersects.length; i++ ) {
    intersects[ i ].object.material.color.set( 0xff0000 );
  }
=======
mesh.rotation.x = 1.05;

document.addEventListener( 'mousedown', onDocumentMouseDown, false );
document.addEventListener( 'touchstart', onDocumentTouchStart, false );
document.addEventListener( 'touchmove', onDocumentTouchMove, false );

function onDocumentMouseDown( event ) {
  event.preventDefault();
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'mouseup', onDocumentMouseUp, false );
  document.addEventListener( 'mouseout', onDocumentMouseOut, false );
  mouseXOnMouseDown = event.clientX - windowHalfX;
  targetRotationOnMouseDown = targetRotation;
}
function onDocumentMouseMove( event ) {
  mouseX = event.clientX - windowHalfX;
  targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
}
function onDocumentMouseUp() {
  document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
  document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
  document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}
function onDocumentMouseOut() {
  document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
  document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
  document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}
function onDocumentTouchStart( event ) {
  if ( event.touches.length == 1 ) {
    event.preventDefault();
    mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;
  }
}
function onDocumentTouchMove( event ) {
  if ( event.touches.length == 1 ) {
    event.preventDefault();
    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) ;
  }
}

const render = () => {
  attack.rotation.y += ( targetRotation - attack.rotation.y );
>>>>>>> fa75af106debc80026bfaa9a2f73f986f55df600
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

const resize = () => {
  const { clientWidth, clientHeight } = canvas;
  renderer.setSize(clientWidth, clientHeight, false);
  camera.aspect = clientWidth / clientHeight;
  renderer.setPixelRatio(window.devicePixelRatio);

  camera.updateProjectionMatrix();
};

THREE.DefaultLoadingManager.onLoad = () => {
  resize();
  render();

};

<<<<<<< HEAD

window.addEventListener('mousemove', onMouseMove, false);
window.requestAnimationFrame(render);
=======
THREE.DefaultLoadingManager.onLoad = () => {
  window.addEventListener('resize', resize);

  resize();
  render();
};
>>>>>>> fa75af106debc80026bfaa9a2f73f986f55df600
