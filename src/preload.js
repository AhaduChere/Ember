// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { webFrame } from 'electron';
import { contextBridge, ipcRenderer } from 'electron';

// Disables Zoom
webFrame.setZoomFactor(1);
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0')) {
    e.preventDefault();
    webFrame.setZoomFactor(1);
  }
});

contextBridge.exposeInMainWorld('electronAPI', {
  checkFolder: () => ipcRenderer.invoke('check-folder'),
  openFolderDialog: () => ipcRenderer.invoke('open-folder-dialog'),
});

import './composables/Icons.js';
