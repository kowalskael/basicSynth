import * as Tone from 'tone';

const gain = new Tone.Gain();
gain.toMaster();

const ampEnv = new Tone.AmplitudeEnvelope();
ampEnv.connect(gain);

const $envAttack = document.querySelector('#env-attack');
$envAttack.addEventListener('input', () => ampEnv.attack = $envAttack.value);
const $envDecay = document.querySelector('#env-decay');
$envDecay.addEventListener('input', () => ampEnv.decay = $envDecay.value);
const $envSustain = document.querySelector('#env-sustain');
$envSustain.addEventListener('input', () => ampEnv.sustain = $envSustain.value);
const $envRelease = document.querySelector('#env-release');
$envRelease.addEventListener('input', () => ampEnv.release = $envRelease.value);

const amp = new Tone.Volume(12);
amp.connect(ampEnv);

const $ampVolume = document.querySelector('#amp-volume');
$ampVolume.addEventListener('input', () => amp.volume.value = $ampVolume.value);

const filter = new Tone.AutoFilter(2, 0.6);
filter.connect(amp).sync().start();

const $filterFreq = document.querySelector('#filter-freq');
$filterFreq.addEventListener('input', () => filter.frequency.value = $filterFreq.value);
const $filterBaseFreq = document.querySelector('#filter-baseFreq');
$filterBaseFreq.addEventListener('input', () => filter.baseFrequency = $filterBaseFreq.value);
const $filterOctaves = document.querySelector('#filter-octaves');
$filterOctaves.addEventListener('input', () => filter.octaves = $filterOctaves.value);
const $filterDepth = document.querySelector('#filter-depth');
$filterDepth.addEventListener('input', () => filter.depth.value = $filterDepth.value);

const filterEnv = new Tone.Envelope();
filterEnv.connect(filter);

/*
const $filterEnvAttack = document.querySelector('#filterEnv-attack');
$filterEnvAttack.addEventListener('input', () => filterEnv.attack = $filterEnvAttack.value);
const $filterEnvDecay = document.querySelector('#filterEnv-decay');
$filterEnvDecay.addEventListener('input', () => filterEnv.decay = $filterEnvDecay.value);
const $filterEnvSustain = document.querySelector('#filterEnv-sustain');
$filterEnvSustain.addEventListener('input', () => filterEnv.sustain = $filterEnvSustain.value);
const $filterEnvRelease = document.querySelector('#filterEnv-release');
$filterEnvRelease.addEventListener('input', () => filterEnv.release = $filterEnvRelease.value);
*/

const pitch = new Tone.PitchShift();
pitch.connect(ampEnv);

const $pitch = document.querySelector('#pitch');
$pitch.addEventListener('input', () => pitch.pitch = $pitch.value);
const $wet = document.querySelector('#wet');
$wet.addEventListener('input', () => pitch.wet.value = $wet.value);

const osc = new Tone.Oscillator(20, 'sine');
osc.fan(ampEnv, filter, pitch);
osc.start();

const $oscSine = document.querySelector('#sine');
$oscSine.addEventListener('click', () => osc.type = 'sine');
const $oscSquare = document.querySelector('#square');
$oscSquare.addEventListener('click', () => osc.type = 'square');
const $oscTriangle = document.querySelector('#triangle');
$oscTriangle.addEventListener('click', () => osc.type = 'triangle');
const $oscSawtooth = document.querySelector('#sawtooth');
$oscSawtooth.addEventListener('click', () => osc.type = 'sawtooth');
const $oscFreq = document.querySelector('#osc-freq');
$oscFreq.addEventListener('input', () => osc.frequency.value = $oscFreq.value);
const $oscPartialCounts = document.querySelector('#osc-partials');
$oscPartialCounts.addEventListener('input', () => osc.partialCount = $oscPartialCounts.value);

const lfo = new Tone.LFO(400, 0, 1);
lfo.connect(ampEnv);
lfo.sync().start();

const $lfoFreq = document.querySelector('#lfo-freq');
$lfoFreq.addEventListener('input', () => lfo.frequency.value = $lfoFreq.value);
const $lfoAmp = document.querySelector('#lfo-amp');
$lfoAmp.addEventListener('input', () => lfo.amplitude.value = $lfoAmp.value);
const $lfoSine = document.querySelector('#lfo-sine');
$lfoSine.addEventListener('click', () => lfo.type = 'sine');
const $lfoSquare = document.querySelector('#lfo-square');
$lfoSquare.addEventListener('click', () => lfo.type = 'square');
const $lfoTriangle = document.querySelector('#lfo-triangle');
$lfoTriangle.addEventListener('click', () => lfo.type = 'triangle');
const $lfoSawtooth = document.querySelector('#lfo-sawtooth');
$lfoSawtooth.addEventListener('click', () => lfo.type = 'sawtooth');

const $toggle = document.querySelector('#toggle');
$toggle.addEventListener('click', function() {
	ampEnv.tiggerAttack = !ampEnv.tiggerAttack;
	//filterEnv.tiggerAttack = !filterEnv.tiggerAttack;
	Tone.Transport.Start = !Tone.Transport.Start;
	if (ampEnv.tiggerAttack && Tone.Transport.Start) {
		ampEnv.triggerAttack();
		//filterEnv.triggerAttack();
		Tone.Transport.start();
	}
	else {
		ampEnv.triggerRelease();
		//filterEnv.triggerRelease();
		Tone.Transport.stop();
	}

});
