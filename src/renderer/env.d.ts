/// <reference types="vite/client" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

interface Window {
	electronAPI?: {
		saveLanguage: (language: import('../shared').Language) => Promise<import('../shared').SaveLanguageResponse>;
		loadLanguage: () => Promise<import('../shared').LoadLanguageResponse>;
		hasSaveGame: () => Promise<import('../shared').HasSaveGameResponse>;
	};
	appControl?: {
		quit: () => Promise<import('../shared').AppControlResponse>;
	};
}
