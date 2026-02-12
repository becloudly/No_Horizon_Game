/**
 * Menu component with localization support
 */

import { subscribe, getTranslations } from '../lib/i18n';
import { hasSaveGame } from '../lib/savegame';
import type { LanguageChangeCallback } from '../lib/i18n';
import { showSettings } from './settings';

const menuButtons = {
	begin: 'btn-begin',
	continue: 'btn-continue',
	options: 'btn-options',
	exit: 'btn-exit',
};

let saveGameExists = false;
let menuScreen: HTMLElement | null = null;
let unsubscribeLanguageUpdates: (() => void) | null = null;

const updateMenuText: LanguageChangeCallback = (_lang, t) => {
	const btnBegin = document.getElementById(menuButtons.begin);
	const btnContinue = document.getElementById(menuButtons.continue);
	const btnOptions = document.getElementById(menuButtons.options);
	const btnExit = document.getElementById(menuButtons.exit);

	// Always hide the original continue button
	if (btnContinue) {
		btnContinue.style.display = 'none';
	}

	// Update begin button text based on save state
	if (btnBegin) {
		const span = btnBegin.querySelector('span');
		if (span) {
			if (saveGameExists) {
				// Change Begin to Continue when save exists
				span.textContent = t.menuWithSave?.continue || t.menu.continue;
			} else {
				span.textContent = t.menu.begin;
			}
		}
	}

	// Update other buttons
	if (btnOptions) {
		const span = btnOptions.querySelector('span');
		if (span) {
			span.textContent = t.menu.options;
		}
	}

	if (btnExit) {
		const span = btnExit.querySelector('span');
		if (span) {
			span.textContent = t.menu.exit;
		}
	}
};

export const initMenu = async (): Promise<void> => {
	// Check for save game
	saveGameExists = await hasSaveGame();
	menuScreen = document.getElementById('menu-screen');

	// Subscribe to language changes
	if (unsubscribeLanguageUpdates) {
		unsubscribeLanguageUpdates();
	}
	unsubscribeLanguageUpdates = subscribe(updateMenuText);

	// Initial update
	const t = getTranslations();
	updateMenuText('en', t);

	// Add button handlers
	const btnBegin = document.getElementById(menuButtons.begin);
	const btnOptions = document.getElementById(menuButtons.options);
	const btnExit = document.getElementById(menuButtons.exit);

	console.log('Menu buttons found:', { btnBegin, btnOptions, btnExit });

	btnBegin?.addEventListener('click', () => {
		console.log('Begin/Continue clicked');
		// TODO: Implement game start logic
	});

	btnOptions?.addEventListener('click', () => {
		console.log('Options clicked');
		menuScreen?.classList.add('menu-fade-out');
		showSettings();
	});

	btnExit?.addEventListener('click', async () => {
		console.log('Exit clicked');
		if (window.appControl?.quit) {
			try {
				const result = await window.appControl.quit();
				if (!result.ok) {
					console.error('Failed to quit app:', result.error);
				}
			} catch (err) {
				console.error('Failed to quit app:', err);
			}
			return;
		}

		console.warn('appControl API not available, closing window');
		window.close();
	});
};

export const showMenuScreen = (): void => {
	if (!menuScreen) {
		menuScreen = document.getElementById('menu-screen');
	}
	menuScreen?.classList.remove('menu-fade-out');
};

export const showMenu = (): void => {
	const app = document.getElementById('app');
	if (app) {
		app.style.opacity = '1';
		app.style.pointerEvents = 'auto';
	}
};

export const hideMenu = (): void => {
	const app = document.getElementById('app');
	if (app) {
		app.style.opacity = '0';
		app.style.pointerEvents = 'none';
	}
};
