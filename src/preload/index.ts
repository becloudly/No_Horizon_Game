import { contextBridge, ipcRenderer } from 'electron';
import { exposeAppControl } from './ipc/app-control';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  saveLanguage: (language: string) => ipcRenderer.invoke('save-language', language),
  loadLanguage: () => ipcRenderer.invoke('load-language'),
  hasSaveGame: () => ipcRenderer.invoke('has-save-game'),
});

exposeAppControl();
