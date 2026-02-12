// Renderer process entry point
import './index.css';
import { initClickSound, enableClickSound, initParallax, loadSavedLanguage } from './lib';
import { loadSettings } from './lib/settings-store';
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

// Load settings from localStorage
loadSettings();
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
