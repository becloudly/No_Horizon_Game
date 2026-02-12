/**
 * Settings screen component (structure only)
 */

import { getTranslations, subscribe } from '../lib/i18n';
import type { LanguageChangeCallback } from '../lib/i18n';

let settingsScreen: HTMLElement | null = null;
let settingsDim: HTMLElement | null = null;
let backButton: HTMLElement | null = null;
let backButtonLabel: HTMLElement | null = null;
let titleLabel: HTMLElement | null = null;
let unsubscribeLanguageUpdates: (() => void) | null = null;

const updateSettingsText: LanguageChangeCallback = (_lang, t) => {
	if (titleLabel) {
		titleLabel.textContent = t.settings.title;
	}
	if (backButtonLabel) {
		backButtonLabel.textContent = t.settings.back;
	}
};

export const initSettings = (onBack: () => void): void => {
	settingsScreen = document.getElementById('settings-screen');
	settingsDim = document.getElementById('settings-dim');
	backButton = document.getElementById('btn-settings-back');
	backButtonLabel = document.getElementById('settings-back-label');
	titleLabel = document.getElementById('settings-title');

	if (!settingsScreen || !settingsDim) {
		console.warn('Settings screen elements not found');
		return;
	}

	updateSettingsText('en', getTranslations());
	if (unsubscribeLanguageUpdates) {
		unsubscribeLanguageUpdates();
	}
	unsubscribeLanguageUpdates = subscribe(updateSettingsText);

	backButton?.addEventListener('click', () => {
		hideSettings();
		onBack();
	});
};

export const showSettings = (): void => {
	if (settingsScreen) {
		settingsScreen.style.visibility = 'visible';
	}
	if (settingsDim) {
		settingsDim.style.visibility = 'visible';
	}
	settingsScreen?.classList.remove('fade-out');
	settingsDim?.classList.add('show');
	settingsScreen?.classList.add('show');
};

export const hideSettings = (): void => {
	settingsScreen?.classList.add('fade-out');
	settingsScreen?.classList.remove('show');
	settingsDim?.classList.remove('show');
	if (settingsScreen) {
		settingsScreen.style.visibility = 'hidden';
	}
	if (settingsDim) {
		settingsDim.style.visibility = 'hidden';
	}
};
