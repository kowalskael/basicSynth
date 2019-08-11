import * as Tone from "tone";
import * as THREE from 'three';
import { Synthesizer } from './Synthesizer';
import { norm, clamp, degToRad, mapRange } from './math';

export class SynthEvents extends Synthesizer {

	constructor(scene, camera, canvas) {
		super(scene, camera, canvas)
		document.addEventListener('mousedown', this.onMouseDown);
		document.addEventListener('mousemove', this.onMouseMove);
		document.addEventListener('mouseup', this.onMouseUp);
		const $toggle = document.querySelector('#toggle-1');
		$toggle.addEventListener('click', this.toneTiggerAttack);
	}

	toneTiggerAttack = () => {
		this.ampEnv.tiggerAttack = !this.ampEnv.tiggerAttack;
		Tone.Transport.Start = !Tone.Transport.Start;
		if (this.ampEnv.tiggerAttack && Tone.Transport.Start) {
			this.ampEnv.triggerAttack();
			Tone.Transport.start();
		} else {
			this.ampEnv.triggerRelease();
			Tone.Transport.stop();
		}
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

			if (this.currentObject === this.rotators[1]) {
				this.currentObject.rotation.y = limit;
				const ampEnvAttack = mapRange(limit, degToRad(-120), degToRad(120), 5, 0);
				this.ampEnv.attack = Math.round(ampEnvAttack);

				//for (let i = 0; this.toneRotators.length > i; i++) {
				//this.toneRotators[i] = Math.round(oscFrequency);
				//}
				console.log(this.ampEnv.attack);
			}

			if (this.currentObject === this.rotators[5]) {
				this.currentObject.rotation.y = limit;
				const lfoFreqVal = mapRange(limit, degToRad(-120), degToRad(120), 1000, 10);
				this.lfo.frequency.value = Math.round(lfoFreqVal);
			}

			if (this.currentObject === this.rotators[6]) {
				this.currentObject.rotation.y = limit;
				const lfoPhase = mapRange(limit, degToRad(-120), degToRad(120), 100, -50);
				this.lfo.phase.value = Math.round(lfoPhase);
			}

			if (this.currentObject === this.rotators[7]) {
				this.currentObject.rotation.y = limit;
				const pitchPitch = mapRange(limit, degToRad(-120), degToRad(120), 36, -36);
				this.pitch.pitch = Math.round(pitchPitch);
			}

			if (this.currentObject === this.rotators[9]) {
				this.currentObject.rotation.y = limit;
				const filterFreq = mapRange(limit, degToRad(-120), degToRad(120), 20, 0);
				this.filter.frequency.value = Math.round(filterFreq);
			}

			if (this.currentObject === this.rotators[10]) {
				this.currentObject.rotation.y = limit;
				const filterOctaves = mapRange(limit, degToRad(-120), degToRad(120), 5, 1);
				this.filter.octaves = Math.round(filterOctaves);
			}

			if (this.currentObject === this.rotators[11]) {
				this.currentObject.rotation.y = limit;
				const filterBaseFreq = mapRange(limit, degToRad(-120), degToRad(120), 2000, 100);
				this.filter.baseFrequency = Math.round(filterBaseFreq);
			}

			if (this.currentObject === this.rotators[12]) {
				this.currentObject.rotation.y = limit;
				const filterDepth = mapRange(limit, degToRad(-120), degToRad(120), 1, 0.5);
				this.filter.depth = Math.round(filterDepth);
			}

			// waveRotators
			if (this.waveRotators.indexOf(this.currentObject) > -1) {
				const waveLimit = clamp(angle, degToRad(-180), degToRad(180));
				if (waveLimit > degToRad(-180) && waveLimit < degToRad(-30)) {
					this.currentObject.rotation.y = degToRad(-90);
				}
				if (waveLimit > degToRad(-30) && waveLimit < degToRad(30)) {
					this.currentObject.rotation.y = degToRad(-30);
				}
				if (waveLimit > degToRad(30) && waveLimit < degToRad(90)) {
					this.currentObject.rotation.y = degToRad(30);
				}
				if (waveLimit > degToRad(90) && waveLimit < degToRad(180)) {
					this.currentObject.rotation.y = degToRad(90);
				}
			}

			// ampVolume
			if (this.currentObject === this.ampVolume) {
				this.currentObject.rotation.y = angle;
				const volume = mapRange(angle, degToRad(-180), degToRad(180), -24, 14);
				this.amp.volume.value = Math.round(volume);
				console.log(this.amp.volume.value);
			}

			// keys
			if (this.keys.indexOf(this.currentObject) > -1) {
				this.currentObject.rotation.x = 0.05;
			}

			// pitchShiftSwitch
			if (this.currentObject === this.pitchShiftSwitch) {
				if (this.pitchShiftSwitch.rotation.x > 0) {
					this.pitchShiftSwitch.rotation.x = degToRad(-40);
				} else {
					this.pitchShiftSwitch.rotation.x = degToRad(40);
				}
			}
		}

	};

	onMouseUp = () => {
		this.isMouseDown = false;
		if (this.currentObject && this.keys.indexOf(this.currentObject) > -1) {
			this.currentObject.rotation.x = 0;
		}
		this.currentObject = null;
	};

	update() {
		// console.log('update');
	}

}

