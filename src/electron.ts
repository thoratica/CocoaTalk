import { app, BrowserWindow } from 'electron';
import { resolve } from 'path';

const createWindow = () => {
  const window = new BrowserWindow({
    height: 720,
    width: 1080,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webviewTag: true,
    },
    show: false,
    frame: false,
  });

  window.once('ready-to-show', window.show);

  window.loadFile(resolve(__dirname, '../index.html'));
  window.webContents.toggleDevTools();
};

app.whenReady().then(() => {
  createWindow();

  require('@electron/remote/main').initialize();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
