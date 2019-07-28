import * as Tone from 'tone';

const gain = new Tone.Gain();
gain.sync();

const env = new Tone.AmplitudeEnvelope({
	"attack": 1.1,
	"decay": 0.2,
	"sustain": 1.0,
	"release": 0.8
	}
);
env.triggerAttack();
env.toMaster();

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

const filter = new Tone.AutoFilter();
filter.start();

const $filterFreq = document.querySelector('#filter-freq');
$filterFreq.addEventListener('input', () => filter.frequency.value = $filterFreq.value);

const panner = new Tone.AutoPanner();
panner.start();
panner.chain(env, filter, gain);

const $pannerFreq = document.querySelector('#panner-freq');
$pannerFreq.addEventListener('input', () => panner.frequency.value = $pannerFreq.value);

const osc0 = new Tone.Oscillator(440, 'square6');
osc0.connect(panner).start();

const $toggle = document.querySelector('#toggle');
$toggle.addEventListener('click', function() {
	Tone.Transport.Start = !Tone.Transport.Start;
	if (Tone.Transport.Start) Tone.Transport.start();
	else Tone.Transport.stop();
});

