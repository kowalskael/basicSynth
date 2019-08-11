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



    this.toneRotators = [
      'osc.partialCount',
      'ampEnv.attack', 'ampEnv.decay', 'ampEnv.sustain', 'ampEnv.release',
      'lfo.frequency.value', 'lfo.phase.value',
      'pitch.pitch', 'PSFT_Delay',
      'filter.frequency.value', 'filter.octaves', 'filter.baseFrequency', 'filter.depth.value',
    ];
  }



  update() {
    // console.log('update');
  }
}
