import * as THREE from 'three';
import { clamp, degToRad, mapRange } from './math';
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

    const gain = new Tone.Gain();
    gain.toMaster();

    const ampEnv = new Tone.AmplitudeEnvelope();
    ampEnv.connect(gain);

    const amp = new Tone.Volume(0);
    amp.connect(ampEnv);

    const filter = new Tone.AutoFilter(2, 0.6);
    filter.connect(amp).sync().start();

    const filterEnv = new Tone.Envelope();
    filterEnv.connect(filter);

    const pitch = new Tone.PitchShift();
    pitch.connect(ampEnv);

    const osc = new Tone.Oscillator(20, 'sine');
    osc.fan(ampEnv, filter, pitch);
    osc.start();

    const lfo = new Tone.LFO(400, 0, 1);
    lfo.connect(ampEnv);
    lfo.sync().start();

    const $toggle = document.querySelector('#toggle-1');
    $toggle.addEventListener('click', function() {
      ampEnv.tiggerAttack = !ampEnv.tiggerAttack;
      Tone.Transport.Start = !Tone.Transport.Start;
      if (ampEnv.tiggerAttack && Tone.Transport.Start) {
        ampEnv.triggerAttack();
        Tone.Transport.start();
      } else {
        ampEnv.triggerRelease();
        Tone.Transport.stop();
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
      }

      // waveRotators
      if (this.waveRotators.indexOf(this.currentObject) > -1) {
        if (angle > degToRad(-180) && angle < degToRad(-30)) {
          this.currentObject.rotation.y = degToRad(-90);
        }
        if (angle > degToRad(-30) && angle < degToRad(30)) {
          this.currentObject.rotation.y = degToRad(-30);
        }
        if (angle > degToRad(30) && angle < degToRad(90)) {
          this.currentObject.rotation.y = degToRad(30);
        }
        if (angle > degToRad(90) && angle < degToRad(180)) {
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
