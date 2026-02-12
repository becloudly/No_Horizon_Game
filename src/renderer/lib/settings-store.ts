/**
 * Settings store with localStorage persistence
 * Manages volume and streamer mode settings
 */

export interface SettingsState {
	volume: number; // 0-100
	streamerMode: boolean;
}

type SettingsChangeCallback = (settings: SettingsState) => void;

const STORAGE_KEY = 'game-settings';
const DEFAULT_SETTINGS: SettingsState = {
	volume: 75,
	streamerMode: false,
};

let currentSettings: SettingsState = { ...DEFAULT_SETTINGS };
const listeners: SettingsChangeCallback[] = [];

/**
 * Load settings from localStorage
 */
export const loadSettings = (): SettingsState => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored) as Partial<SettingsState>;
			currentSettings = {
				volume: typeof parsed.volume === 'number' ? Math.max(0, Math.min(100, parsed.volume)) : DEFAULT_SETTINGS.volume,
				streamerMode: typeof parsed.streamerMode === 'boolean' ? parsed.streamerMode : DEFAULT_SETTINGS.streamerMode,
			};
		}
	} catch (err) {
		console.error('Failed to load settings from localStorage:', err);
		currentSettings = { ...DEFAULT_SETTINGS };
	}
	return currentSettings;
};

/**
 * Save settings to localStorage
 */
const saveSettings = (): void => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
	} catch (err) {
		console.error('Failed to save settings to localStorage:', err);
	}
};

/**
 * Notify all subscribers of settings change
 */
const notifyListeners = (): void => {
	listeners.forEach((callback) => callback(currentSettings));
};

/**
 * Get current settings
 */
export const getSettings = (): SettingsState => {
	return { ...currentSettings };
};

/**
 * Subscribe to settings changes
 */
export const subscribe = (callback: SettingsChangeCallback): (() => void) => {
	listeners.push(callback);
	// Immediately call with current settings
	callback(currentSettings);
	
	return () => {
		const index = listeners.indexOf(callback);
		if (index > -1) {
			listeners.splice(index, 1);
		}
	};
};

/**
 * Update volume (0-100)
 */
export const setVolume = (volume: number): void => {
	const clampedVolume = Math.max(0, Math.min(100, volume));
	if (currentSettings.volume === clampedVolume) return;
	
	currentSettings.volume = clampedVolume;
	saveSettings();
	notifyListeners();
};

/**
 * Toggle streamer mode
 */
export const setStreamerMode = (enabled: boolean): void => {
	if (currentSettings.streamerMode === enabled) return;
	
	currentSettings.streamerMode = enabled;
	saveSettings();
	notifyListeners();
};
