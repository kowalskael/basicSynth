import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import obj from './assets/elsynth_1.gltf';

let targetRotation = 0;
let targetRotationOnMouseDown = 0;
let mouseX = 0;
let mouseXOnMouseDown = 0;
const windowHalfX = window.innerWidth / 2;

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

let attack;
let release;

const mesh = new THREE.Object3D();
loader.load(obj, gltf => {
  mesh.add(gltf.scene);
  loadModel.add(mesh);
  attack = mesh.getObjectByName('ENV_Atack');
  release = mesh.getObjectByName('ENV_Release');
});


mesh.rotation.x = 1.15;

document.addEventListener( 'mousedown', onDocumentMouseDown);
document.addEventListener( 'touchstart', onDocumentTouchStart);
document.addEventListener( 'touchmove', onDocumentTouchMove);

function onDocumentMouseDown( event ) {
  document.addEventListener( 'mousemove', onDocumentMouseMove);
  document.addEventListener( 'mouseup', onDocumentMouseUp );
  document.addEventListener( 'mouseout', onDocumentMouseOut);
  mouseXOnMouseDown = event.clientX;
  targetRotationOnMouseDown = targetRotation;
}
function onDocumentMouseMove( event ) {
  mouseX = event.clientX;
  targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;
}
function onDocumentMouseUp() {
  document.removeEventListener( 'mousemove', onDocumentMouseMove);
}
function onDocumentMouseOut() {
  document.removeEventListener('mousemove', onDocumentMouseMove);
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
  window.addEventListener('resize', resize);

  resize();
  render();
};

