// Renderer process entry point
import './index.css';
import { initClickSound, enableClickSound, initParallax, loadSavedLanguage } from './lib';
import { settings } from './lib/settings.svelte';
import {
	initSplash,
	initDisclaimer,
	showDisclaimer,
	initMenu,
	showMenu,
	hideMenu,
	initSettings,
	showMenuScreen,
} from './components';

console.log('Renderer process initialized');

// Initialize audio
initClickSound();

// Initialize parallax effect
initParallax();

// Hide menu initially
hideMenu();

// Initialize Svelte settings store (loads from localStorage)
settings.subscribe(() => {
	// Store is now initialized and reactive
});
console.log('Settings loaded from localStorage');

// Initialize components
const initializeComponents = async (): Promise<void> => {
	await initMenu();
	initSettings(() => {
		showMenuScreen();
	});
	initDisclaimer(() => {
		// Show menu after disclaimer is dismissed
		showMenu();
	});
};

initializeComponents();

// Load saved language preference
loadSavedLanguage().then((lang) => {
	console.log('Loaded language:', lang);
}).catch((err) => {
	console.error('Failed to load language:', err);
});

// Start application flow: Splash → Disclaimer → Menu
initSplash(() => {
	enableClickSound();
	showDisclaimer();
});
