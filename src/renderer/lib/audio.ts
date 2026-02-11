/**
 * Audio manager for click sounds
 */

let clickSound: HTMLAudioElement | null = null;
let clickSoundEnabled = false;

export const initClickSound = (): void => {
	clickSound = new Audio('/Audio/mouse-clicking.mp3');
	clickSound.volume = 0.3;

	document.addEventListener('click', () => {
		if (clickSound && clickSoundEnabled) {
			clickSound.currentTime = 0;
			clickSound.play().catch((err) => console.warn('Audio play failed:', err));
		}
	});
};

export const enableClickSound = (): void => {
	clickSoundEnabled = true;
};

export const disableClickSound = (): void => {
	clickSoundEnabled = false;
};
