/// <reference types="vite/client" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

interface Window {
	electronAPI?: {
		saveLanguage: (language: string) => Promise<boolean>;
		loadLanguage: () => Promise<string>;
		hasSaveGame: () => Promise<boolean>;
	};
	appControl?: {
		quit: () => Promise<import('../shared/ipc').AppControlResponse>;
	};
}
