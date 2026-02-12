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
let menuTrackSourceIndex = 0;

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));
const clampPercent = (value: number): number => Math.min(100, Math.max(0, value));
const applyGlobalVolume = (baseVolume: number): number => clamp01(baseVolume) * globalVolume;
const resolveAssetUrl = (path: string): string => new URL(path, window.location.href).toString();

const MENU_TRACK_SOURCES = [
	'Audio/soundtrack/menu_track.mp3',
	'/Audio/soundtrack/menu_track.mp3',
	'Audio/keyboard.mp3',
	'/Audio/keyboard.mp3',
] as const;

const CLICK_SOUND_SOURCES = [
	'Audio/mouse-clicking.mp3',
	'/Audio/mouse-clicking.mp3',
] as const;

const tryNextMenuTrackSource = (): void => {
	if (!menuTrack) {
		return;
	}

	menuTrackSourceIndex += 1;
	if (menuTrackSourceIndex >= MENU_TRACK_SOURCES.length) {
		menuTrackSourceIndex = MENU_TRACK_SOURCES.length - 1;
	}

	menuTrack.src = resolveAssetUrl(MENU_TRACK_SOURCES[menuTrackSourceIndex]);
	menuTrack.load();
	pendingMenuTrackPlay = true;
};

const playMenuTrack = (): void => {
	if (!menuTrack) {
		return;
	}

	menuTrack.muted = false;
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

export const initClickSound = (): void => {
	clickSound = new Audio(resolveAssetUrl(CLICK_SOUND_SOURCES[0]));
	clickSound.addEventListener('error', () => {
		clickSound = new Audio(resolveAssetUrl(CLICK_SOUND_SOURCES[1]));
		clickSound.volume = applyGlobalVolume(1);
	});
	clickSound.volume = applyGlobalVolume(1);

	const resumeMenuTrack = (): void => {
		if (!menuTrack) {
			return;
		}
		if (!pendingMenuTrackPlay && !menuTrack.paused && menuTrack.currentTime > 0) {
			return;
		}
		playMenuTrack();
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
		menuTrack.muted = false;
		menuTrack.volume = applyGlobalVolume(menuTrackBaseVolume);
	}
};

export const getGlobalVolume = (): number => globalVolume * 100;

export const startMenuTrackFadeIn = (targetBaseVolume = 1, fadeDurationMs = 1000): void => {
	if (!menuTrack) {
		menuTrackSourceIndex = 0;
		menuTrack = new Audio(resolveAssetUrl(MENU_TRACK_SOURCES[0]));
		menuTrack.loop = true;
		menuTrack.preload = 'auto';
		menuTrack.muted = false;
		menuTrack.volume = 0;
		menuTrack.addEventListener('error', tryNextMenuTrackSource);
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

	playMenuTrack();

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
