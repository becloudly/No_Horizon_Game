/**
 * Settings screen component with full settings UI
 */

import { getTranslations, subscribe, setLanguage, getCurrentLanguage } from '../lib/i18n';
import type { LanguageChangeCallback } from '../lib/i18n';
import type { Language } from '../locales';
import { 
	loadSettings, 
	subscribe as subscribeSettings, 
	setVolume, 
	setStreamerMode,
	type SettingsState 
} from '../lib/settings-store';

let settingsScreen: HTMLElement | null = null;
let settingsDim: HTMLElement | null = null;
let backButton: HTMLElement | null = null;
let backButtonLabel: HTMLElement | null = null;
let titleLabel: HTMLElement | null = null;
let settingsContent: HTMLElement | null = null;
let unsubscribeLanguageUpdates: (() => void) | null = null;
let unsubscribeSettingsUpdates: (() => void) | null = null;

// UI Element references
let languageLabel: HTMLElement | null = null;
let volumeLabel: HTMLElement | null = null;
let volumeValue: HTMLElement | null = null;
let volumeSlider: HTMLInputElement | null = null;
let streamerModeLabel: HTMLElement | null = null;
let streamerModeToggle: HTMLElement | null = null;
let languageDropdown: HTMLSelectElement | null = null;

const updateSettingsText: LanguageChangeCallback = (_lang, t) => {
	if (titleLabel) {
		titleLabel.textContent = t.settings.title;
	}
	if (backButtonLabel) {
		backButtonLabel.textContent = t.settings.back;
	}
	if (languageLabel) {
		languageLabel.textContent = t.settings.language;
	}
	if (volumeLabel) {
		volumeLabel.textContent = t.settings.volume;
	}
	if (streamerModeLabel) {
		streamerModeLabel.textContent = t.settings.streamerMode;
	}
	
	// Update tooltip text
	const tooltip = document.getElementById('streamer-mode-tooltip');
	if (tooltip) {
		tooltip.textContent = t.settings.streamerModeTooltip;
	}
};

const createSettingsUI = (): void => {
	if (!settingsContent) return;

	const t = getTranslations();
	const currentLang = getCurrentLanguage();
	const settings = loadSettings();

	settingsContent.innerHTML = `
		<div class="settings-panel max-w-2xl w-full mx-auto space-y-12">
			<!-- Language Setting -->
			<div class="setting-item">
				<label id="language-label" class="setting-label font-mono text-lg tracking-widest text-white/80 mb-3 block">
					${t.settings.language}
				</label>
				<select id="language-dropdown" class="language-dropdown w-full bg-black/60 border border-white/30 text-white/90 px-6 py-3 font-mono text-base tracking-wide transition-all duration-300 hover:border-white/50 focus:border-white focus:outline-none focus:shadow-[0_0_12px_rgba(255,255,255,0.3)]">
					<option value="en" ${currentLang === 'en' ? 'selected' : ''}>English</option>
					<option value="de" ${currentLang === 'de' ? 'selected' : ''}>Deutsch</option>
				</select>
			</div>

			<!-- Volume Setting -->
			<div class="setting-item">
				<div class="flex justify-between items-center mb-3">
					<label id="volume-label" class="setting-label font-mono text-lg tracking-widest text-white/80">
						${t.settings.volume}
					</label>
					<span id="volume-value" class="font-mono text-lg text-white/90 min-w-[4rem] text-right">
						${settings.volume}%
					</span>
				</div>
				<div class="volume-slider-container relative">
					<input 
						type="range" 
						id="volume-slider" 
						min="0" 
						max="100" 
						value="${settings.volume}" 
						class="volume-slider w-full h-2 bg-white/20 appearance-none cursor-pointer transition-all duration-300"
						style="--value: ${settings.volume}%"
					/>
					<div class="volume-track-fill absolute top-1/2 -translate-y-1/2 left-0 h-2 bg-gradient-to-r from-white/60 to-white/90 pointer-events-none transition-all duration-150" style="width: ${settings.volume}%"></div>
				</div>
			</div>

			<!-- Streamer Mode Setting -->
			<div class="setting-item">
				<div class="flex justify-between items-center">
					<div class="flex-1">
						<label id="streamer-mode-label" class="setting-label font-mono text-lg tracking-widest text-white/80 mb-2 block relative group cursor-help" aria-describedby="streamer-mode-tooltip">
							${t.settings.streamerMode}
							<div id="streamer-mode-tooltip" role="tooltip" class="tooltip absolute left-0 top-full mt-4 w-80 bg-black/95 border border-white/40 p-4 font-mono text-sm text-white/80 leading-relaxed opacity-0 transition-opacity duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] z-50">
								${t.settings.streamerModeTooltip}
							</div>
						</label>
					</div>
					<div 
						id="streamer-mode-toggle" 
						class="streamer-toggle relative inline-block w-20 h-10 transition-all duration-300 cursor-pointer"
						data-enabled="${settings.streamerMode}"
						role="switch"
						aria-checked="${settings.streamerMode}"
						aria-labelledby="streamer-mode-label"
						tabindex="0"
					>
						<div class="toggle-track absolute inset-0 bg-white/20 border border-white/30 transition-all duration-300"></div>
						<div class="toggle-thumb absolute top-1 left-1 w-8 h-8 bg-white/90 transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.3)]"></div>
						<div class="toggle-glow absolute inset-0 opacity-0 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.6)]"></div>
					</div>
				</div>
			</div>
		</div>
	`;

	// Cache references
	languageLabel = document.getElementById('language-label');
	volumeLabel = document.getElementById('volume-label');
	volumeValue = document.getElementById('volume-value');
	volumeSlider = document.getElementById('volume-slider') as HTMLInputElement;
	streamerModeLabel = document.getElementById('streamer-mode-label');
	streamerModeToggle = document.getElementById('streamer-mode-toggle');
	languageDropdown = document.getElementById('language-dropdown') as HTMLSelectElement;

	// Setup event listeners
	setupLanguageDropdown();
	setupVolumeSlider();
	setupStreamerModeToggle();
	setupTooltip();
};

const setupLanguageDropdown = (): void => {
	if (!languageDropdown) return;

	languageDropdown.addEventListener('change', (e) => {
		const target = e.target as HTMLSelectElement;
		const lang = target.value as Language;
		setLanguage(lang);
	});
};

const setupVolumeSlider = (): void => {
	if (!volumeSlider || !volumeValue) return;

	const updateVolume = (value: number) => {
		if (volumeValue) {
			volumeValue.textContent = `${value}%`;
		}
		if (volumeSlider) {
			volumeSlider.style.setProperty('--value', `${value}%`);
		}
		
		// Update fill track
		const fillTrack = document.querySelector('.volume-track-fill') as HTMLElement;
		if (fillTrack) {
			fillTrack.style.width = `${value}%`;
		}
	};

	volumeSlider.addEventListener('input', (e) => {
		const target = e.target as HTMLInputElement;
		const value = parseInt(target.value, 10);
		updateVolume(value);
	});

	volumeSlider.addEventListener('change', (e) => {
		const target = e.target as HTMLInputElement;
		const value = parseInt(target.value, 10);
		setVolume(value);
	});
};

const setupStreamerModeToggle = (): void => {
	if (!streamerModeToggle) return;

	const updateToggleUI = (enabled: boolean) => {
		if (!streamerModeToggle) return;
		
		streamerModeToggle.setAttribute('data-enabled', String(enabled));
		streamerModeToggle.setAttribute('aria-checked', String(enabled));
		
		const track = streamerModeToggle.querySelector('.toggle-track') as HTMLElement;
		const thumb = streamerModeToggle.querySelector('.toggle-thumb') as HTMLElement;
		const glow = streamerModeToggle.querySelector('.toggle-glow') as HTMLElement;

		if (enabled) {
			// Active state
			if (track) {
				track.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
				track.style.borderColor = 'rgba(255, 255, 255, 0.7)';
			}
			if (thumb) {
				thumb.style.transform = 'translateX(40px)';
				thumb.style.backgroundColor = 'rgba(255, 255, 255, 1)';
				thumb.style.boxShadow = '0 0 16px rgba(255, 255, 255, 0.8)';
			}
			if (glow) {
				glow.style.opacity = '1';
			}
		} else {
			// Inactive state
			if (track) {
				track.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
				track.style.borderColor = 'rgba(255, 255, 255, 0.3)';
			}
			if (thumb) {
				thumb.style.transform = 'translateX(0)';
				thumb.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
				thumb.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.3)';
			}
			if (glow) {
				glow.style.opacity = '0';
			}
		}
	};

	const toggleSwitch = () => {
		if (!streamerModeToggle) return;
		const currentState = streamerModeToggle.getAttribute('data-enabled') === 'true';
		const newState = !currentState;
		updateToggleUI(newState);
		setStreamerMode(newState);
	};

	streamerModeToggle.addEventListener('click', toggleSwitch);
	
	// Add keyboard support
	streamerModeToggle.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggleSwitch();
		}
	});

	// Set initial state
	const settings = loadSettings();
	updateToggleUI(settings.streamerMode);
};

const setupTooltip = (): void => {
	if (!streamerModeLabel) return;

	streamerModeLabel.addEventListener('mouseenter', () => {
		const tooltip = document.getElementById('streamer-mode-tooltip');
		if (tooltip) {
			tooltip.style.opacity = '1';
			tooltip.style.pointerEvents = 'auto';
		}
	});

	streamerModeLabel.addEventListener('mouseleave', () => {
		const tooltip = document.getElementById('streamer-mode-tooltip');
		if (tooltip) {
			tooltip.style.opacity = '0';
			tooltip.style.pointerEvents = 'none';
		}
	});
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

	// Create settings content container if it doesn't exist
	settingsContent = settingsScreen.querySelector('.settings-content') as HTMLElement;
	if (!settingsContent) {
		settingsContent = document.createElement('div');
		settingsContent.className = 'settings-content absolute inset-0 flex items-center justify-center pt-24 pb-16 px-8 overflow-y-auto';
		
		// Insert before title to keep title visible
		const centerContainer = settingsScreen.querySelector('.absolute.inset-0.flex.items-center.justify-center');
		if (centerContainer) {
			settingsScreen.insertBefore(settingsContent, centerContainer);
		} else {
			settingsScreen.appendChild(settingsContent);
		}
	}

	// Initialize UI
	createSettingsUI();

	// Subscribe to language changes
	updateSettingsText('en', getTranslations());
	if (unsubscribeLanguageUpdates) {
		unsubscribeLanguageUpdates();
	}
	unsubscribeLanguageUpdates = subscribe(updateSettingsText);

	// Subscribe to settings changes
	if (unsubscribeSettingsUpdates) {
		unsubscribeSettingsUpdates();
	}
	unsubscribeSettingsUpdates = subscribeSettings((settings: SettingsState) => {
		// Update UI when settings change from external sources
		if (volumeSlider && parseInt(volumeSlider.value, 10) !== settings.volume) {
			volumeSlider.value = String(settings.volume);
			if (volumeValue) {
				volumeValue.textContent = `${settings.volume}%`;
			}
		}
	});

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
