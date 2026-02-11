import { en } from './en';
import { de } from './de';

export type Language = 'en' | 'de';
export type Translations = typeof en;

export const translations: Record<Language, Translations> = {
	en,
	de,
};

export { en, de };
