/**
 * Internationalization manager with persistent storage via IPC
 */

import type { Language, Translations } from '../locales';
import { translations } from '../locales';

export type LanguageChangeCallback = (lang: Language, t: Translations) => void;

let currentLanguage: Language = 'en';
const listeners: LanguageChangeCallback[] = [];

export const getCurrentLanguage = (): Language => currentLanguage;

export const getTranslations = (lang?: Language): Translations => {
	return translations[lang ?? currentLanguage];
};

export const subscribe = (callback: LanguageChangeCallback): (() => void) => {
	listeners.push(callback);
	return () => {
		const index = listeners.indexOf(callback);
		if (index > -1) {
			listeners.splice(index, 1);
		}
	};
};

const notifyListeners = (): void => {
	const t = getTranslations();
	listeners.forEach((callback) => callback(currentLanguage, t));
};

export const setLanguage = async (lang: Language): Promise<void> => {
	if (currentLanguage === lang) return;
	currentLanguage = lang;

	// Save to AppData via IPC
	if (window.electronAPI) {
		try {
			await window.electronAPI.saveLanguage(lang);
		} catch (err) {
			console.error('Failed to save language:', err);
		}
	}

	notifyListeners();
};

export const loadSavedLanguage = async (): Promise<Language> => {
	if (window.electronAPI) {
		try {
			const savedLang = await window.electronAPI.loadLanguage();
			currentLanguage = (savedLang === 'de' ? 'de' : 'en') as Language;
		} catch (err) {
			console.error('Failed to load language:', err);
			currentLanguage = 'en';
		}
	}
	return currentLanguage;
};
