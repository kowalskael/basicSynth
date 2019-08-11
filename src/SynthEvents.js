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

		if (this.currentObject) {

			// rotators
			if (this.rotators.indexOf(this.currentObject) > -1) {
				const limit = clamp(angle, degToRad(-120), degToRad(120));
				this.currentObject.rotation.y = limit;
				const oscFrequency = mapRange(limit, degToRad(-120), degToRad(120), 32, 0);
				this.osc.partialCount = Math.round(oscFrequency);
				console.log(this.osc.partialCount);
			}

			// waveRotators
			if (this.waveRotators.indexOf(this.currentObject) > -1) {
				const limit = clamp(angle, degToRad(-180), degToRad(180));
				if (limit > degToRad(-180) && limit < degToRad(-30)) {
					this.currentObject.rotation.y = degToRad(-90);
				}
				if (limit > degToRad(-30) && limit < degToRad(30)) {
					this.currentObject.rotation.y = degToRad(-30);
				}
				if (limit > degToRad(30) && limit < degToRad(90)) {
					this.currentObject.rotation.y = degToRad(30);
				}
				if (limit > degToRad(90) && limit < degToRad(180)) {
					this.currentObject.rotation.y = degToRad(90);
				}
			}

			// ampVolume
			if (this.currentObject === this.ampVolume) {
				this.currentObject.rotation.y = angle;
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

