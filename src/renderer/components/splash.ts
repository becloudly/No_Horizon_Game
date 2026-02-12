/**
 * Splash screen component
 */

export const initSplash = (onComplete: () => void): void => {
	const splashScreen1 = document.getElementById('splash-screen');
	const splashScreen2 = document.getElementById('splash-screen-2');

	if (!splashScreen1 || !splashScreen2) {
		console.warn('Splash screen elements not found');
		onComplete();
		return;
	}

	const splashScreens: HTMLElement[] = [splashScreen1, splashScreen2];
	const showDurationMs = 4000;
	const fadeDurationMs = 1000;

	const showSplash = (element: HTMLElement): void => {
		element.style.visibility = 'visible';
		element.classList.remove('hidden', 'fade-out', 'opacity-100', 'reveal');
		element.classList.add('opacity-0');
	};

	const hideSplash = (element: HTMLElement): void => {
		element.classList.add('fade-out');
		setTimeout(() => {
			element.classList.add('hidden');
			element.classList.remove('opacity-100');
			element.style.visibility = 'hidden';
		}, fadeDurationMs);
	};

	const runSequence = (index: number): void => {
		const current = splashScreens[index];
		if (!current) {
			onComplete();
			return;
		}

		showSplash(current);
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				current.classList.remove('opacity-0');
				current.classList.add('opacity-100');
			});
		});
		setTimeout(() => {
			hideSplash(current);
			setTimeout(() => {
				runSequence(index + 1);
			}, fadeDurationMs);
		}, showDurationMs);
	};

	runSequence(0);
};
