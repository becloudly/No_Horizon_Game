/**
 * Disclaimer screen component with language toggle
 */

import type { Language } from '../locales';
import { setLanguage, getCurrentLanguage, getTranslations, subscribe } from '../lib/i18n';

let disclaimerScreen: HTMLElement | null = null;
let langEnBtn: HTMLElement | null = null;
let langDeBtn: HTMLElement | null = null;
let disclaimerEn: HTMLElement | null = null;
let disclaimerDe: HTMLElement | null = null;
let proceedBtn: HTMLElement | null = null;

const updateLanguageUI = (lang: Language): void => {
	const enTranslations = getTranslations('en');
	const deTranslations = getTranslations('de');

	if (disclaimerEn) {
		disclaimerEn.textContent = enTranslations.disclaimer;
	}

	if (disclaimerDe) {
		disclaimerDe.textContent = deTranslations.disclaimer;
	}

	if (lang === 'en') {
		disclaimerEn?.classList.remove('hidden');
		disclaimerDe?.classList.add('hidden');
		langEnBtn?.classList.remove('opacity-40', 'border-transparent');
		langEnBtn?.classList.add('opacity-90', 'border-white/70');
		langDeBtn?.classList.remove('opacity-90', 'border-white/70');
		langDeBtn?.classList.add('opacity-40', 'border-transparent');
	} else {
		disclaimerEn?.classList.add('hidden');
		disclaimerDe?.classList.remove('hidden');
		langDeBtn?.classList.remove('opacity-40', 'border-transparent');
		langDeBtn?.classList.add('opacity-90', 'border-white/70');
		langEnBtn?.classList.remove('opacity-90', 'border-white/70');
		langEnBtn?.classList.add('opacity-40', 'border-transparent');
	}
	
	// Update proceed button text
	const t = getTranslations(lang);
	if (proceedBtn) {
		proceedBtn.textContent = t.proceedBtn;
	}
};

const switchLanguage = async (lang: Language): Promise<void> => {
	await setLanguage(lang);
	updateLanguageUI(lang);
};

export const initDisclaimer = (onProceed: () => void): void => {
	disclaimerScreen = document.getElementById('disclaimer-screen');
	langEnBtn = document.getElementById('lang-en');
	langDeBtn = document.getElementById('lang-de');
	disclaimerEn = document.getElementById('disclaimer-en');
	disclaimerDe = document.getElementById('disclaimer-de');
	proceedBtn = document.getElementById('proceed-btn');

	if (!disclaimerScreen) {
		console.warn('Disclaimer screen element not found');
		onProceed();
		return;
	}

	// Set initial language UI
	updateLanguageUI(getCurrentLanguage());
	subscribe((lang) => {
		updateLanguageUI(lang);
	});

	// Language toggle listeners
	langEnBtn?.addEventListener('click', () => switchLanguage('en'));
	langDeBtn?.addEventListener('click', () => switchLanguage('de'));

	// Proceed button listener
	proceedBtn?.addEventListener('click', () => {
		disclaimerScreen?.classList.add('fade-out');
		setTimeout(() => {
			if (disclaimerScreen) {
				disclaimerScreen.style.display = 'none';
			}
			onProceed();
		}, 1000);
	});
};

export const showDisclaimer = (): void => {
	disclaimerScreen?.classList.add('show');
};
