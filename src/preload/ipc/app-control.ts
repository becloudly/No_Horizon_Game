import { contextBridge, ipcRenderer } from 'electron';
import { APP_CONTROL_CHANNEL, type AppControlRequest, type AppControlResponse } from '../../shared/ipc';

const quitRequest: AppControlRequest = { type: 'app/quit' };

export const exposeAppControl = (): void => {
	contextBridge.exposeInMainWorld('appControl', {
		quit: async (): Promise<AppControlResponse> => ipcRenderer.invoke(APP_CONTROL_CHANNEL, quitRequest),
	});
};
