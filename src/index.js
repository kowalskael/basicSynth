import * as Tone from 'tone';
import { model } from './model';

/*
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
const $filterBaseFreq = document.querySelector('#filter-base-freq');
$filterBaseFreq.addEventListener('input', () => filter.baseFrequency = $filterBaseFreq.value);
const $filterOctaves = document.querySelector('#filter-octaves');
$filterOctaves.addEventListener('input', () => filter.octaves = $filterOctaves.value);
const $filterDepth = document.querySelector('#filter-depth');
$filterDepth.addEventListener('input', () => filter.depth.value = $filterDepth.value);

const filterEnv = new Tone.Envelope();
filterEnv.connect(filter);

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
const $oscPartialCounts = document.querySelector('#osc-partials');
$oscPartialCounts.addEventListener('input', () => osc.partialCount = $oscPartialCounts.value);

const indexToFreq = index => 87.31 * Math.pow(Math.pow(2, 1 / 12), index + 1);

const $keyFreq = [...document.querySelectorAll('#keyboard div')];

$keyFreq.forEach((key, index) => key.addEventListener('click', () => osc.frequency.value = indexToFreq(index)));

const keyCodes = $keyFreq.map(div => div.getAttribute('data-key'));

window.addEventListener('keydown', event => {
	console.log(event.code);
	const index = keyCodes.indexOf(event.code);
	osc.frequency.value = indexToFreq(index);
});

const lfo = new Tone.LFO(400, 0, 1);
lfo.connect(ampEnv);
lfo.sync().start();

const $lfoFreq = document.querySelector('#lfo-freq');
$lfoFreq.addEventListener('input', () => lfo.frequency.value = $lfoFreq.value);
const $lfoAmp = document.querySelector('#lfo-phase');
$lfoAmp.addEventListener('input', () => lfo.phase.value = $lfoPhase.value);
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
	Tone.Transport.Start = !Tone.Transport.Start;
	if (ampEnv.tiggerAttack && Tone.Transport.Start) {
		ampEnv.triggerAttack();
		Tone.Transport.start();
	} else {
		ampEnv.triggerRelease();
		Tone.Transport.stop();
	}

});

 */
