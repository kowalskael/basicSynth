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

let sustain;
let decay;
let attack;
let release;

const mesh = new THREE.Object3D();
loader.load(obj, gltf => {
  mesh.add(gltf.scene);
  loadModel.add(mesh);
  console.log(dumpObject(mesh).join('\n'));
  sustain = mesh.getObjectByName('ENV_Sustain');
  decay = mesh.getObjectByName('ENV_Decay');
  attack = mesh.getObjectByName('ENV_Atack');
  release = mesh.getObjectByName('ENV_Release');
});

mesh.rotation.x = 0.7;

const render = (time) => {
  time *= 0.001;

  if (sustain) {
    sustain.rotation.y = time + 0.3;
  }

  if (decay) {
    decay.rotation.y = time - 3;
  }

  if (release) {
    release.rotation.y = time;
  }

  if (attack) {
    attack.rotation.y = time * 0.5;
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


resize();
render();

