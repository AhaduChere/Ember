import { app, dialog } from 'electron';
import fs from 'fs';

export function checkMusicFolder(): boolean {
  try {
    const musicPath = app.getPath('music');
    // return fs.existsSync(musicPath);
    return false;
  } catch {
    return false;
  }
}

export async function openFolderDialog(): Promise<string | null> {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  return result.filePaths[0] || null;
}
