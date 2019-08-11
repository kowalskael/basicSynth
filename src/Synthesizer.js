import * as THREE from 'three';
import { norm, clamp, degToRad, mapRange } from './math';
import * as Tone from 'tone';


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
      'OSC_Partial',
      'ENV_Atack', 'ENV_Decay', 'ENV_Sustain', 'ENV_Release',
      'LFO_Freq', 'LFO_Phase',
      'PSFT_Pitch', 'PSFT_Delay',
      'FLTR_Freq', 'FLTR_Octaves', 'FLTR_BaseFreq', 'FLTR_Depth',
    ].map(rotator => scene.getObjectByName(rotator));
    this.waveRotators = [
      'OSC_Wave',
      'LFO_Wave',
      'FLTR_Wave',
    ].map(waveRotator => scene.getObjectByName(waveRotator));
    this.pitchShiftSwitch = scene.getObjectByName('PSFT_Switch');
    this.ampVolume = scene.getObjectByName('AMP_Volume');
    this.LCD = scene.getObjectByName('LCD');

    this.allObjects = [
      ...this.keys,
      ...this.rotators,
      ...this.waveRotators,
      this.ampVolume,
      this.pitchShiftSwitch,
    ];

    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);

    this.gain = new Tone.Gain();
    this.gain.toMaster();

    this.ampEnv = new Tone.AmplitudeEnvelope();
    this.ampEnv.connect(this.gain);

    this.amp = new Tone.Volume(0);
    this.amp.connect(this.ampEnv);

    this.filter = new Tone.AutoFilter(2, 0.6);
    this.filter.connect(this.amp).sync().start();

    this.filterEnv = new Tone.Envelope();
    this.filterEnv.connect(this.filter);

    this.pitch = new Tone.PitchShift();
    this.pitch.connect(this.ampEnv);

    this.osc = new Tone.Oscillator({
      type  : 'sine' ,
      frequency  : 440 ,
      partialCount  : 1
    });
    this.osc.fan(this.ampEnv, this.filter, this.pitch);
    this.osc.start();

    this.lfo = new Tone.LFO(400, 0, 1);
    this.lfo.connect(this.ampEnv);
    this.lfo.sync().start();

    const $toggle = document.querySelector('#toggle-1');
    $toggle.addEventListener('click', function() {
      this.ampEnv.tiggerAttack = !this.ampEnv.tiggerAttack;
      this.Tone.Transport.Start = !this.Tone.Transport.Start;
      if (this.ampEnv.tiggerAttack && this.Tone.Transport.Start) {
        this.ampEnv.triggerAttack();
        this.Tone.Transport.start();
      } else {
        this.ampEnv.triggerRelease();
        this.Tone.Transport.stop();
      }
    });
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
      mapRange(event.clientY, 0, this.canvas.clientHeight, 1, -1),
    );

    const x = event.clientX - this.currentObjectCenter.x;
    const y = event.clientY - this.currentObjectCenter.y;
    const angle = -Math.atan2(y, x);

    if (this.currentObject) {

      // rotators
      if (this.rotators.indexOf(this.currentObject) > -1) {
        const limit = clamp(angle, degToRad(-120), degToRad(120));
        this.currentObject.rotation.y = limit;
        const oscFrequency = mapRange(limit, degToRad(-120), degToRad(120), 1000, 20);
        this.osc.frequency.value = oscFrequency;
        console.log(this.osc.frequency.value);
      }

      // waveRotators
      if (this.waveRotators.indexOf(this.currentObject) > -1) {
        const limit = clamp(angle, degToRad(-180), degToRad(180));
        if (limit > degToRad(-180) && limit < degToRad(-30)) {
          this.currentObject.rotation.y = degToRad(-90);
        }
        if (limit > degToRad(-30) && limit < degToRad(30)) {
          this.currentObject.rotation.y = degToRad(-30);
        }
        if (limit > degToRad(30) && limit < degToRad(90)) {
          this.currentObject.rotation.y = degToRad(30);
        }
        if (limit > degToRad(90) && limit < degToRad(180)) {
          this.currentObject.rotation.y = degToRad(90);
        }
      }

      // ampVolume
      if (this.currentObject === this.ampVolume) {
        this.currentObject.rotation.y = angle;
      }

      // keys
      if (this.keys.indexOf(this.currentObject) > -1) {
        this.currentObject.rotation.x = 0.05;
      }

      // pitchShiftSwitch
      if (this.currentObject === this.pitchShiftSwitch) {
        if (this.pitchShiftSwitch.rotation.x > 0) {
          this.pitchShiftSwitch.rotation.x = degToRad(-40);
        } else {
          this.pitchShiftSwitch.rotation.x = degToRad(40);
        }
      }
    }

  };

  onMouseUp = () => {
    this.isMouseDown = false;
    if (this.currentObject && this.keys.indexOf(this.currentObject) > -1) {
      this.currentObject.rotation.x = 0;
    }
    this.currentObject = null;
  };

  update() {
    // console.log('update');
  }
}
