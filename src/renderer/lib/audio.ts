/**
 * Audio manager for click sounds
 */

let clickSound: HTMLAudioElement | null = null;
let clickSoundEnabled = false;
let menuTrack: HTMLAudioElement | null = null;
let menuTrackFadeHandle: number | null = null;
let menuTrackBaseVolume = 1;
let globalVolume = 0.2;
let pendingMenuTrackPlay = false;

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));
const clampPercent = (value: number): number => Math.min(100, Math.max(0, value));
const applyGlobalVolume = (baseVolume: number): number => clamp01(baseVolume) * globalVolume;

export const initClickSound = (): void => {
	clickSound = new Audio('/Audio/mouse-clicking.mp3');
	clickSound.volume = applyGlobalVolume(1);

	const resumeMenuTrack = (): void => {
		if (!menuTrack) {
			return;
		}
		if (!pendingMenuTrackPlay && !menuTrack.paused) {
			return;
		}
		menuTrack.volume = applyGlobalVolume(menuTrackBaseVolume);
		menuTrack.play()
			.then(() => {
				pendingMenuTrackPlay = false;
			})
			.catch((err) => {
				pendingMenuTrackPlay = true;
				console.warn('Menu track play failed:', err);
			});
	};

	document.addEventListener('click', () => {
		if (clickSound && clickSoundEnabled) {
			clickSound.currentTime = 0;
			clickSound.play().catch((err) => console.warn('Audio play failed:', err));
		}
		resumeMenuTrack();
	});

	document.addEventListener('keydown', resumeMenuTrack);
};

export const enableClickSound = (): void => {
	clickSoundEnabled = true;
};

export const disableClickSound = (): void => {
	clickSoundEnabled = false;
};

export const setGlobalVolume = (percent: number): void => {
	const clamped = clampPercent(percent);
	globalVolume = clamped / 100;

	if (clickSound) {
		clickSound.volume = applyGlobalVolume(1);
	}

	if (menuTrack) {
		menuTrack.volume = applyGlobalVolume(menuTrackBaseVolume);
	}
};

export const getGlobalVolume = (): number => globalVolume * 100;

export const startMenuTrackFadeIn = (targetBaseVolume = 1, fadeDurationMs = 1000): void => {
	if (!menuTrack) {
		menuTrack = new Audio('/Audio/soundtrack/menu_track.mp3');
		menuTrack.loop = true;
		menuTrack.volume = 0;
	}

	menuTrackBaseVolume = clamp01(targetBaseVolume);

	if (menuTrackFadeHandle !== null) {
		cancelAnimationFrame(menuTrackFadeHandle);
		menuTrackFadeHandle = null;
	}

	const startTime = performance.now();
	const startVolume = menuTrack.volume;
	const targetVolume = applyGlobalVolume(menuTrackBaseVolume);
	const volumeDelta = targetVolume - startVolume;

	menuTrack.play().catch((err) => {
		console.warn('Menu track play failed:', err);
		pendingMenuTrackPlay = true;
	});

	const step = (now: number): void => {
		const elapsed = now - startTime;
		const progress = Math.min(1, elapsed / fadeDurationMs);
		menuTrack!.volume = startVolume + volumeDelta * progress;

		if (progress < 1) {
			menuTrackFadeHandle = requestAnimationFrame(step);
		} else {
			menuTrackFadeHandle = null;
		}
	};

	menuTrackFadeHandle = requestAnimationFrame(step);
};
