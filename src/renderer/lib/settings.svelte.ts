/**
 * Svelte stores for settings state management with localStorage persistence
 */

import { writable, derived, type Writable } from 'svelte/store';

export interface SettingsState {
	volume: number; // 0-100
	streamerMode: boolean;
}

const STORAGE_KEY = 'game-settings';
const DEFAULT_SETTINGS: SettingsState = {
	volume: 75,
	streamerMode: false,
};

/**
 * Load settings from localStorage
 */
function loadSettings(): SettingsState {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			
			// Validate structure
			if (typeof parsed !== 'object' || parsed === null) {
				console.warn('Invalid settings data, using defaults');
				return { ...DEFAULT_SETTINGS };
			}
			
			return {
				volume: typeof parsed.volume === 'number' ? Math.max(0, Math.min(100, parsed.volume)) : DEFAULT_SETTINGS.volume,
				streamerMode: typeof parsed.streamerMode === 'boolean' ? parsed.streamerMode : DEFAULT_SETTINGS.streamerMode,
			};
		}
	} catch (err) {
		console.error('Failed to load settings from localStorage:', err);
	}
	return { ...DEFAULT_SETTINGS };
}

/**
 * Save settings to localStorage
 */
function saveSettings(settings: SettingsState): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	} catch (err) {
		console.error('Failed to save settings to localStorage:', err);
	}
}

// Initialize settings from localStorage
const initialSettings = loadSettings();

// Create main settings store
function createSettingsStore() {
	const { subscribe, set, update } = writable<SettingsState>(initialSettings);
	
	// Save to localStorage on every change
	subscribe((value) => {
		saveSettings(value);
	});
	
	return {
		subscribe,
		setVolume: (volume: number) => {
			const clampedVolume = Math.max(0, Math.min(100, volume));
			update(s => ({ ...s, volume: clampedVolume }));
		},
		setStreamerMode: (enabled: boolean) => {
			update(s => ({ ...s, streamerMode: enabled }));
		},
		reset: () => set({ ...DEFAULT_SETTINGS })
	};
}

export const settings = createSettingsStore();

// Derived stores for individual settings
export const volume = derived(settings, $settings => $settings.volume);
export const streamerMode = derived(settings, $settings => $settings.streamerMode);
