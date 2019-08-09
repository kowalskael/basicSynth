import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import obj from './assets/elsynth_1.gltf';

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

  scene.updateMatrixWorld(true);
  var position = new THREE.Vector3();
  position.getPositionFromMatrix( attack.matrixWorld );
  console.log(position.x + ',' + position.y + ',' + position.z);
});

mesh.rotation.x = 1.15;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

let rotation = 0;

const onMouseDown = () => {
  document.addEventListener( 'mousemove', onMouseMove);
  document.addEventListener( 'mouseup', onMouseUp );
};

const onMouseMove = event => {
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  let x;
  if (event.type === 'touchmove') {
    if (event.touches.length !== 1) {
      return;
    }
    x = event.touches[0].clientX;
  } else {
    x = event.clientX;
  }

  rotation = x * 0.05;
  attack.rotation.y += rotation * 0.001;
};

const onMouseUp = () => {
  document.removeEventListener( 'mousemove', onMouseMove);
  document.removeEventListener( 'mouseup', onMouseUp);
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
  camera.updateProjectionMatrix();
};


THREE.DefaultLoadingManager.onLoad = () => {
  document.addEventListener( 'mousedown', onMouseDown);
  window.addEventListener('resize', resize);

  resize();
  render();
};

window.addEventListener( 'onclick', onMouseMove);
window.requestAnimationFrame(render);

