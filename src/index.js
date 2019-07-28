import * as Tone from 'tone';

const gain = new Tone.Gain();
gain.toMaster();

const env = new Tone.AmplitudeEnvelope({
	"attack": 5.1,
	"decay": 10.2,
	"sustain": 1.0,
	"release": 5.8
	}
);
env.toMaster();

const $envAttack = document.querySelector('#env-attack');
$envAttack.addEventListener('input', () => env.attack = $envAttack.value);

const $envDecay = document.querySelector('#env-decay');
$envDecay.addEventListener('input', () => env.decay = $envDecay.value);

const $envSustain = document.querySelector('#env-sustain');
$envSustain.addEventListener('input', () => env.sustain = $envSustain.value);

const $envRelease = document.querySelector('#env-release');
$envRelease.addEventListener('input', () => env.release = $envRelease.value);
console.log($envRelease.value);

const osc = new Tone.Oscillator(20, 'sine');
osc.connect(env);
osc.sync().start();

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
console.log($oscPartialCounts.value);


const $toggle = document.querySelector('#toggle');
$toggle.addEventListener('click', function() {
	Tone.Transport.Start = !Tone.Transport.Start;
	if (Tone.Transport.Start) {
		Tone.Transport.start();
		env.triggerAttack();
	}
	else {
		Tone.Transport.stop();
		env.triggerRelease();
	}
});

