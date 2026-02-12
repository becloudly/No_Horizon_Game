import { en } from './en';
import { de } from './de';
import type { Language } from '../../shared';
export type { Language } from '../../shared';

type WidenLiterals<T> = T extends string
	? string
	: T extends object
		? { [K in keyof T]: WidenLiterals<T[K]> }
		: T;

export type Translations = WidenLiterals<typeof en>;

export const translations: Record<Language, Translations> = {
	en,
	de,
};

export { en, de };
