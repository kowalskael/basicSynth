import * as Tone from 'tone';

const gain = new Tone.Gain();
gain.toMaster();

const env = new Tone.AmplitudeEnvelope();
env.connect(gain);

const $envAttack = document.querySelector('#env-attack');
$envAttack.addEventListener('input', () => env.attack = $envAttack.value);
const $envDecay = document.querySelector('#env-decay');
$envDecay.addEventListener('input', () => env.decay = $envDecay.value);
const $envSustain = document.querySelector('#env-sustain');
$envSustain.addEventListener('input', () => env.sustain = $envSustain.value);
const $envRelease = document.querySelector('#env-release');
$envRelease.addEventListener('input', () => env.release = $envRelease.value);

const osc = new Tone.Oscillator(20, 'sine');
osc.connect(env);
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
lfo.connect(env);
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
	env.tiggerAttack = !env.tiggerAttack;
	Tone.Transport.Start = !Tone.Transport.Start;
	if (env.tiggerAttack && Tone.Transport.Start) {
		env.triggerAttack();
		Tone.Transport.start();
	}
	else {
		env.triggerRelease();
		Tone.Transport.stop();
	}

});
