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

	// First splash: show for 4 seconds then fade out
	setTimeout(() => {
		splashScreen1.classList.add('fade-out');
		
		// After first splash fades, show second splash
		setTimeout(() => {
			splashScreen1.classList.add('hidden');
			splashScreen2.style.visibility = 'visible';
			splashScreen2.classList.remove('opacity-0');
			splashScreen2.classList.add('opacity-100');
			
			// Second splash: show for 4 seconds then fade out
			setTimeout(() => {
				splashScreen2.classList.add('fade-out');
				
				setTimeout(() => {
					splashScreen2.classList.add('hidden');
					onComplete();
				}, 1000); // Match CSS transition duration
			}, 4000); // Show second splash for 4 seconds
		}, 1000); // Match CSS transition duration
	}, 4000); // Show first splash for 4 seconds
};
