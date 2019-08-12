import * as THREE from 'three';
import * as Tone from 'tone';
import { norm, clamp, degToRad, mapRange } from './math';

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
      'LFO_Freq', 'LFO_Phase',
      'PSFT_Pitch', 'PSFT_Delay',
      'FLTR_Freq', 'FLTR_Octaves', 'FLTR_BaseFreq', 'FLTR_Depth',
    ].map(rotator => scene.getObjectByName(rotator));

    this.envRotators = [
      'ENV_Atack', 'ENV_Decay', 'ENV_Sustain', 'ENV_Release',
    ].map(envRotator => scene.getObjectByName(envRotator));

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
      ...this.envRotators,
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

    this.osc = new Tone.Oscillator(440, 'sine');
    this.osc.fan(this.ampEnv, this.filter, this.pitch);
    this.osc.start();

    this.lfo = new Tone.LFO(400, 0, 1);
    this.lfo.connect(this.ampEnv);
    this.lfo.sync().start();

    this.envToneRotators = [
      'ampEnv.attack', 'ampEnv.decay', 'ampEnv.sustain', 'ampEnv.release',
    ];
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
    const limit = clamp(angle, degToRad(-120), degToRad(120));

    if (this.currentObject) {

      // rotators
      if (this.currentObject === this.rotators[0]) {
        this.currentObject.rotation.y = limit;
        const oscPartialCount = mapRange(limit, degToRad(-120), degToRad(120), 32, 0);
        this.osc.partialCount = Math.round(oscPartialCount);
      }

      if (this.currentObject === this.envRotators[0]) {
        this.currentObject.rotation.y = limit;
        const ampEnvValue = mapRange(limit, degToRad(-120), degToRad(120), 10, 0);
        this.ampEnv.attack = Math.round(ampEnvValue);
      }

      if (this.currentObject === this.envRotators[1]) {
        this.currentObject.rotation.y = limit;
        const ampEnvValue = mapRange(limit, degToRad(-120), degToRad(120), 10, 0);
        this.ampEnv.decay = Math.round(ampEnvValue);
      }

      if (this.currentObject === this.envRotators[2]) {
        this.currentObject.rotation.y = limit;
        const ampEnvValue = mapRange(limit, degToRad(-120), degToRad(120), 10, 0);
        this.ampEnv.sustain = Math.round(ampEnvValue);
      }

      if (this.currentObject === this.envRotators[3]) {
        this.currentObject.rotation.y = limit;
        const ampEnvValue = mapRange(limit, degToRad(-120), degToRad(120), 10, 0);
        this.ampEnv.release = Math.round(ampEnvValue);
      }

      if (this.currentObject === this.rotators[1]) {
        this.currentObject.rotation.y = limit;
        const lfoFreqVal = mapRange(limit, degToRad(-120), degToRad(120), 1000, 10);
        this.lfo.frequency.value = Math.round(lfoFreqVal);
      }


      if (this.currentObject === this.rotators[2]) {
        this.currentObject.rotation.y = limit;
        const lfoPhase = mapRange(limit, degToRad(-120), degToRad(120), 100, -50);
        this.lfo.phase.value = Math.round(lfoPhase);
      }

      if (this.currentObject === this.rotators[3]) {
        this.currentObject.rotation.y = limit;
        const pitchPitch = mapRange(limit, degToRad(-120), degToRad(120), 36, -36);
        this.pitch.pitch = Math.round(pitchPitch);
      }

      if (this.currentObject === this.rotators[5]) {
        this.currentObject.rotation.y = limit;
        const filterFreq = mapRange(limit, degToRad(-120), degToRad(120), 20, 0);
        this.filter.frequency.value = Math.round(filterFreq);
      }

      if (this.currentObject === this.rotators[6]) {
        this.currentObject.rotation.y = limit;
        const filterOctaves = mapRange(limit, degToRad(-120), degToRad(120), 5, 1);
        this.filter.octaves = Math.round(filterOctaves);
      }

      if (this.currentObject === this.rotators[7]) {
        this.currentObject.rotation.y = limit;
        const filterBaseFreq = mapRange(limit, degToRad(-120), degToRad(120), 2000, 100);
        this.filter.baseFrequency = Math.round(filterBaseFreq);
      }

      if (this.currentObject === this.rotators[8]) {
        this.currentObject.rotation.y = limit;
        const filterDepth = mapRange(limit, degToRad(-120), degToRad(120), 1, 0.5);
        this.filter.depth = Math.round(filterDepth);
      }

      // waveRotators
      if (this.currentObject === this.waveRotators[0]) {
        const waveLimit = clamp(angle, degToRad(-180), degToRad(180));
        if (waveLimit > degToRad(-180) && waveLimit < degToRad(-30)) {
          this.currentObject.rotation.y = degToRad(-90);
          this.osc.type = 'sawtooth';
        }
        if (waveLimit > degToRad(-30) && waveLimit < degToRad(30)) {
          this.currentObject.rotation.y = degToRad(-30);
          this.osc.type = 'square';
        }
        if (waveLimit > degToRad(30) && waveLimit < degToRad(90)) {
          this.currentObject.rotation.y = degToRad(30);
          this.osc.type = 'triangle';
        }
        if (waveLimit > degToRad(90) && waveLimit < degToRad(180)) {
          this.currentObject.rotation.y = degToRad(90);
          this.osc.type = 'sine';
        }
      }

      if (this.currentObject === this.waveRotators[1]) {
        const waveLimit = clamp(angle, degToRad(-180), degToRad(180));
        if (waveLimit > degToRad(-180) && waveLimit < degToRad(-30)) {
          this.currentObject.rotation.y = degToRad(-90);
          this.lfo.type = 'sawtooth';
        }
        if (waveLimit > degToRad(-30) && waveLimit < degToRad(30)) {
          this.currentObject.rotation.y = degToRad(-30);
          this.lfo.type = 'square';
        }
        if (waveLimit > degToRad(30) && waveLimit < degToRad(90)) {
          this.currentObject.rotation.y = degToRad(30);
          this.lfo.type = 'triangle';
        }
        if (waveLimit > degToRad(90) && waveLimit < degToRad(180)) {
          this.currentObject.rotation.y = degToRad(90);
          this.lfo.type = 'sine';
        }
      }

      if (this.currentObject === this.waveRotators[2]) {
        const waveLimit = clamp(angle, degToRad(-180), degToRad(180));
        if (waveLimit > degToRad(-180) && waveLimit < degToRad(-30)) {
          this.currentObject.rotation.y = degToRad(-90);
          this.filter.type = 'sawtooth';
        }
        if (waveLimit > degToRad(-30) && waveLimit < degToRad(30)) {
          this.currentObject.rotation.y = degToRad(-30);
          this.filter.type = 'square';
        }
        if (waveLimit > degToRad(30) && waveLimit < degToRad(90)) {
          this.currentObject.rotation.y = degToRad(30);
          this.filter.type = 'triangle';
        }
        if (waveLimit > degToRad(90) && waveLimit < degToRad(180)) {
          this.currentObject.rotation.y = degToRad(90);
          this.filter.type = 'sine';
        }
      }

      // ampVolume
      if (this.currentObject === this.ampVolume) {
        this.currentObject.rotation.y = angle;
        const volume = mapRange(angle, degToRad(-180), degToRad(180), -24, 14);
        this.amp.volume.value = Math.round(volume);
      }

      // keys
      if (this.keys.indexOf(this.currentObject) > -1) {
        this.currentObject.rotation.x = 0.05;
        //const indexToFreq = index => 87.31 * Math.pow(Math.pow(2, 1 / 12), index + 1);
        //this.keys.forEach((index) => this.osc.frequency.value = indexToFreq(index));
        this.ampEnv.triggerAttack();
        Tone.Transport.start();

      }

      // pitchShiftSwitch
      if (this.currentObject === this.pitchShiftSwitch) {
        if (this.pitchShiftSwitch.rotation.x > 0) {
          this.pitchShiftSwitch.rotation.x = degToRad(-40);
          this.pitch.wet.value = 0;
        } else {
          this.pitchShiftSwitch.rotation.x = degToRad(40);
          this.pitch.wet.value = 1;
        }
      }
    }

  };

  onMouseUp = () => {
    this.isMouseDown = false;
    if (this.currentObject && this.keys.indexOf(this.currentObject) > -1) {
      this.currentObject.rotation.x = 0;
      this.ampEnv.triggerRelease();
      Tone.Transport.stop();
    }

    this.currentObject = null;
  };

  update() {
    // console.log('update');
  }
}
