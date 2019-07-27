console.clear();

class Instrument {
 constructor() {
   this.synthType = null;
   this.synth = null;
   this.gain = new Tone.Gain();
   this.gain.toMaster();
 }

 get defaultSettings() {
   return {
     Synth: {
       oscillator: { type: 'sine' }
     }
   };
 }

 updateSynthType(synthType) {
   let newSynth = new Tone[synthType]();
   console.log(this.defaultSettings[synthType]);
 }
}

let inst = new Instrument();
inst.updateSynthType('sine');




