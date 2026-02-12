export const APP_CONTROL_CHANNEL = 'app:control' as const;

export const SAVE_LANGUAGE_CHANNEL = 'save-language' as const;
export const LOAD_LANGUAGE_CHANNEL = 'load-language' as const;
export const HAS_SAVE_GAME_CHANNEL = 'has-save-game' as const;

export const SUPPORTED_LANGUAGES = ['en', 'de'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const isLanguage = (value: unknown): value is Language => {
	return typeof value === 'string' && SUPPORTED_LANGUAGES.includes(value as Language);
};

export type SaveLanguageRequest = {
	language: Language;
};

export type SaveLanguageResponse =
	| {
			ok: true;
	  }
	| {
			ok: false;
			error: string;
	  };

export type LoadLanguageResponse = Language;
export type HasSaveGameResponse = boolean;

export type AppControlRequest = {
	type: 'app/quit';
};

export type AppControlResponse =
	| {
			ok: true;
		}
	| {
			ok: false;
			error: string;
		};
