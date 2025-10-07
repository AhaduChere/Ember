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
  openFolderDialog: () => ipcRenderer.invoke('open-folder-dialog'),
  LoadSongs: (folder) => ipcRenderer.invoke('load-songs', folder),
  getMp3Buffer: (filePath) => ipcRenderer.invoke('get-mp3-buffer', filePath),
  getFolders: (folder) => ipcRenderer.invoke('get-folders', folder),
});

import './composables/Icons.js';
