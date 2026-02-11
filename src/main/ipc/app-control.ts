import type { BrowserWindow } from 'electron';
import { app, ipcMain } from 'electron';
import { APP_CONTROL_CHANNEL, type AppControlRequest, type AppControlResponse } from '../../shared/ipc';

export const registerAppControlIpc = (getMainWindow: () => BrowserWindow | null): void => {
	ipcMain.handle(APP_CONTROL_CHANNEL, async (_event, request: AppControlRequest): Promise<AppControlResponse> => {
		switch (request.type) {
			case 'app/quit': {
				const mainWindow = getMainWindow();
				try {
					if (mainWindow && !mainWindow.isDestroyed()) {
						mainWindow.destroy();
					}

					app.quit();

					setTimeout(() => {
						app.exit(0);
					}, 250);

					return { ok: true };
				} catch (error) {
					return {
						ok: false,
						error: error instanceof Error ? error.message : 'Unknown error',
					};
				}
			}
			default:
				return { ok: false, error: 'Unsupported request' };
		}
	});
};
