import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { registerAppControlIpc } from './ipc/app-control';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: true,
    autoHideMenuBar: true,
    backgroundColor: '#000000',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      autoplayPolicy: 'no-user-gesture-required',
    },
    show: false,
  });

  Menu.setApplicationMenu(null);
  mainWindow.setMenuBarVisibility(false);

  mainWindow.setTitle('No Horizon');

  if (!app.isPackaged && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.whenReady().then(() => {
  // Language storage handlers
  const languageFilePath = join(app.getPath('userData'), 'language.json');
  const saveGameFilePath = join(app.getPath('userData'), 'savegame.json');

  ipcMain.handle('save-language', async (_event, language: string) => {
    try {
      await Bun.write(languageFilePath, JSON.stringify({ language }));
      return true;
    } catch (error) {
      console.error('Failed to save language:', error);
      return false;
    }
  });

  ipcMain.handle('load-language', async () => {
    try {
      const file = Bun.file(languageFilePath);
      if (await file.exists()) {
        const data = await file.json();
        return data.language || 'en';
      }
      return 'en';
    } catch (error) {
      console.error('Failed to load language:', error);
      return 'en';
    }
  });

  ipcMain.handle('has-save-game', async () => {
    try {
      const file = Bun.file(saveGameFilePath);
      return await file.exists();
    } catch (error) {
      console.error('Failed to check save game:', error);
      return false;
    }
  });

  registerAppControlIpc(() => mainWindow);

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
