import * as Tone from 'tone';

const osc = new Tone.Oscillator(20, 'sine');
const gain = new Tone.Gain();
osc.sync().start();
osc.connect(gain);
gain.toMaster();

const $oscType = document.querySelector('#osc-type');
$oscType.addEventListener('change', () => osc.type = $oscType.value);

const $oscFreq = document.querySelector('#osc-freq');
$oscFreq.addEventListener('input', () => osc.frequency.value = $oscFreq.value);

const $oscPartialCounts = document.querySelector('#osc-partials');
$oscPartialCounts.addEventListener('input', () => osc.partialCount = $oscPartialCounts.value);

const $toggle = document.querySelector('#toggle');
$toggle.addEventListener('click', function() {
	Tone.Transport.Start = !Tone.Transport.Start;
	if (Tone.Transport.Start) Tone.Transport.start();
	else Tone.Transport.stop();
});

