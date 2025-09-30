import { app, dialog } from 'electron';
import fs from 'fs';

export function checkMusicFolder() {
  try {
    const musicPath = app.getPath('music');
    return fs.existsSync(musicPath) ? musicPath : null;
  } catch {
    return null;
  }
}

export async function openFolderDialog() {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  return result.filePaths[0] || null;
}
