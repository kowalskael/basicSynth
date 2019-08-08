import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import obj from './assets/elsynth_1.gltf';

const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});

const camera = new THREE.PerspectiveCamera(50, 2, 0.1, 1000);
camera.position.set(0, 0, 50);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const controls = new OrbitControls( camera, renderer.domElement);

controls.screenSpacePanning = false;
controls.minDistance = 10;
controls.maxDistance = 80;
controls.maxAzimuthAngle = Math.PI / 3;
controls.minAzimuthAngle = - Math.PI / 5;
controls.maxPolarAngle = Math.PI / 1.5;
controls.minPolarAngle = Math.PI / 3;
controls.update();

const spotLight = new THREE.SpotLight( 0xb5b5b5);
spotLight.position.set( 0, 1000, 0 );
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

let objects = [];

let attack;
let release;

const mesh = new THREE.Object3D();
loader.load(obj, gltf => {
  mesh.add(gltf.scene);
  loadModel.add(mesh);

  attack = mesh.getObjectByName('ENV_Atack');
  release = mesh.getObjectByName('ENV_Release');
  objects.push(attack);
  objects.push(release);
});

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
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

const resize = () => {
  const { clientWidth, clientHeight } = canvas;
  renderer.setSize(clientWidth, clientHeight, false);
  camera.aspect = clientWidth / clientHeight;
  renderer.setPixelRatio(window.devicePixelRatio);
  controls.update();
  camera.updateProjectionMatrix();
};

THREE.DefaultLoadingManager.onLoad = () => {
  resize();
  render();

};


window.addEventListener('mousemove', onMouseMove, false);
window.requestAnimationFrame(render);
