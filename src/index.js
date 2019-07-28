import * as Tone from 'tone';

class Oscillator {
  constructor() {
    this.oscType = null;
    this.osc = null;
    this.gain = new Tone.Gain();
    this.gain.toMaster();
  }

  get defaultSettings() {
    return {
      Oscillator:
        {
          type: 'sine',
          frequency: 440 ,
          detune: 0 ,
          phase: 0 ,
          partials: [] ,
          partialCount: 0
        }
    };
  }

  updateOscType(oscType) {

    if (this.osc) {
      this.osc.disconnect(this.gain);
      this.osc.dispose();
    }

    let settings = this.defaultSettings[oscType] || {};
    this.osc = new Tone[oscType](settings);
    this.osc.connect(this.gain);
    this.osc.start();
    console.log(settings);
  }
}

let $oscType = document.querySelector('#osc-type');
let osc = new Oscillator();
osc.updateOscType($oscType.value);
$oscType.addEventListener('change', e =>
  osc.updateOscType($oscType.value)
);

