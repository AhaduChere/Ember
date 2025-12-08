// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { webFrame } from 'electron';
import { contextBridge, ipcRenderer } from 'electron';

// Disables Zoom
webFrame.setZoomFactor(1);
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && ['+', '-', '0', 'r'].includes(e.key)) {
    e.preventDefault();
  }
  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault();
  }
});

contextBridge.exposeInMainWorld('electronAPI', {
  checkMusicFolder: () => ipcRenderer.invoke('check-folder'),
  loadSongs: (filepath) => ipcRenderer.invoke('load-songs', filepath),
  getFileBuffer: (filePath) => ipcRenderer.invoke('get-file-buffer', filePath),
  getFolders: (folder) => ipcRenderer.invoke('get-folders', folder),
  refreshApp: () => ipcRenderer.invoke('refresh-app'),
  getFolderCover: (folderPath) => ipcRenderer.invoke('getFolderCover', folderPath),
});

import './composables/Icons.js';
