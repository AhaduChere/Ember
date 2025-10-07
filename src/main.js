import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { checkMusicFolder, openFolderDialog, LoadSongs, getMp3Buffer, getFolders } from './utils/FolderSetup.js';

if (started) app.quit();

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    fullscreen: false,
    resizable: true,
    height: 600,
    width: 800,
    minHeight: 600,
    minWidth: 800,
    frame: true,
    icon: path.join(__dirname, 'src', 'assets', 'Icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  return mainWindow;
};

// Menu.setApplicationMenu(null);
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('check-folder', () => checkMusicFolder());
ipcMain.handle('open-folder-dialog', () => openFolderDialog());
ipcMain.handle('load-songs', (_, folder) => LoadSongs(folder));
ipcMain.handle('get-mp3-buffer', (_, filePath) => getMp3Buffer(filePath));
ipcMain.handle('get-folders', (_, folder) => getFolders(folder));
