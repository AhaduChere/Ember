import { webFrame } from 'electron';

webFrame.setZoomFactor(1);

window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0')) {
    e.preventDefault();
    webFrame.setZoomFactor(1);
  }
});

// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
