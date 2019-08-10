import * as THREE from 'three';
import { mapRange } from './math';

export class Synthesizer {
  raycaster = new THREE.Raycaster();
  mouseVec = new THREE.Vector2();
  currentObjectCenter = new THREE.Vector2();
  isMouseDown = false;

  constructor(scene, camera, canvas) {
    this.scene = scene;
    this.camera = camera;
    this.canvas = canvas;

    this.keys = [
      'C', 'C_',
      'D', 'D_',
      'E',
      'F', 'F_',
      'G', 'G_',
      'A', 'A_',
      'B',
      'CC', 'CC_',
      'DD', 'DD_',
      'EE',
      'FF', 'FF_',
      'GG', 'GG_',
      'AA', 'AA_',
      'BB',
      'CCC',
    ].map(keyName => scene.getObjectByName(keyName));

    this.rotators = [
      'OSC_Wave', 'OSC_Partial',
      'ENV_Atack', 'ENV_Decay', 'ENV_Sustain', 'ENV_Release',
      'LFO_Wave', 'LFO_Freq', 'LFO_Phase',
      'PSFT_Pitch', 'PSFT_Delay',
      'FLTR_Wave', 'FLTR_Freq', 'FLTR_Octaves', 'FLTR_BaseFreq', 'FLTR_Depth',
      'AMP_Volume',
    ].map(rotator => scene.getObjectByName(rotator));
    this.pitchShiftSwitch = scene.getObjectByName('PSFT_Switch');
    this.LCD = scene.getObjectByName('LCD');

    this.allObjects = [
      ...this.keys,
      ...this.rotators,
      this.pitchShiftSwitch,
    ];

    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseDown = event => {
    this.isMouseDown = true;
    this.mouseVec.set(
      mapRange(event.clientX, 0, this.canvas.clientWidth, -1, 1),
      mapRange(event.clientY, 0, this.canvas.clientHeight, 1, -1),
    );

    this.raycaster.setFromCamera(this.mouseVec, this.camera);
    const intersects = this.raycaster.intersectObjects(this.allObjects);
    if (intersects && intersects.length > 0) {
      this.currentObject = intersects[0].object;
      const vector = new THREE.Vector3();
      vector.setFromMatrixPosition(this.currentObject.matrixWorld);
      vector.project(this.camera);

      this.currentObjectCenter.set(
        mapRange(vector.x, -1, 1, 0, this.canvas.clientWidth),
        mapRange(vector.y, -1, 1, this.canvas.clientHeight, 0),
      );

      console.log(this.currentObject.name);
      console.log(this.currentObjectCenter);
    }
  };

  onMouseMove = event => {
    if (!this.isMouseDown) return;

    this.mouseVec.set(
      mapRange(event.clientX, 0, this.canvas.clientWidth, -1, 1),
      mapRange(event.clientY, 0, this.canvas.clientHeight, -1, 1),
    );


    const x = event.clientX - this.currentObjectCenter.x;
    const y = event.clientY - this.currentObjectCenter.y;

    this.currentObject.rotation.y = -Math.atan2(y, x);
    console.log(this.currentObject.rotation.y);
    
  };

  onMouseUp = () => {
    this.isMouseDown = false;
    this.currentObject = null;
  };

  update() {
    // console.log('update');
  }
}
