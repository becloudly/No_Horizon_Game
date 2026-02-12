import { contextBridge, ipcRenderer } from 'electron';
import { exposeAppControl } from './ipc/app-control';
import {
  HAS_SAVE_GAME_CHANNEL,
  LOAD_LANGUAGE_CHANNEL,
  SAVE_LANGUAGE_CHANNEL,
  type HasSaveGameResponse,
  type Language,
  type LoadLanguageResponse,
  type SaveLanguageRequest,
  type SaveLanguageResponse,
} from '../shared';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  saveLanguage: (language: Language): Promise<SaveLanguageResponse> =>
	ipcRenderer.invoke(SAVE_LANGUAGE_CHANNEL, { language } satisfies SaveLanguageRequest),
  loadLanguage: (): Promise<LoadLanguageResponse> => ipcRenderer.invoke(LOAD_LANGUAGE_CHANNEL),
  hasSaveGame: (): Promise<HasSaveGameResponse> => ipcRenderer.invoke(HAS_SAVE_GAME_CHANNEL),
});

exposeAppControl();
