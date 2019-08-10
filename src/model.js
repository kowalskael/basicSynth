import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import obj from './assets/elsynth_1.gltf';
import { dumpObject } from './dumpObject';
import { Synthesizer } from './Synthesizer';

const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

const camera = new THREE.PerspectiveCamera(10, 2, 0.1, 1000);
camera.position.set(0, 0, 200);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const spotLight = new THREE.SpotLight(0xb5b5b5);
spotLight.position.set(0, 200, 150);
spotLight.penumbra = 2;
scene.add(spotLight);

const loader = new GLTFLoader();
loader.load(obj, gltf => {
  gltf.scene.rotation.x = 1.15;
  scene.add(gltf.scene);
  scene.updateMatrixWorld(true);
});

const resize = () => {
  const { clientWidth, clientHeight } = canvas;
  renderer.setSize(clientWidth, clientHeight, false);
  camera.aspect = clientWidth / clientHeight;
  renderer.setPixelRatio(window.devicePixelRatio);
  camera.updateProjectionMatrix();
};

let synth;

const render = () => {
  requestAnimationFrame(render);
  synth.update();
  renderer.render(scene, camera);
};

THREE.DefaultLoadingManager.onLoad = () => {
  window.addEventListener('resize', resize);
  resize();
  synth = new Synthesizer(scene, camera, canvas);
  render();
};
