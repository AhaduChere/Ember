import { app, dialog } from 'electron';
import path from 'node:path';
import fs from 'fs';

export function checkMusicFolder() {
  const musicPath = app.getPath('music');
  return fs.existsSync(musicPath) ? musicPath : null;
}

export async function openFolderDialog() {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  return result.filePaths[0] || null;
}

export function getMp3Buffer(filePath) {
  return fs.readFileSync(filePath);
}

export function LoadSongs(filepath) {
  if (filepath.endsWith('.mp3')) {
    const folder = path.dirname(filepath);
    const files = fs.readdirSync(folder);
    const mp3s = files.filter((file) => file.endsWith('.mp3'));
    return mp3s.map((file) => ({
      name: path.parse(file).name.split('-')[0]?.trim(),
      artist: path.parse(file).name.split('-')[1]?.trim() ?? 'Unknown',
      path: path.join(folder, file),
    }));
  } else {
    const files = fs.readdirSync(filepath);
    const mp3s = files.filter((file) => file.endsWith('.mp3'));
    return mp3s.map((file) => ({
      name: path.parse(file).name.split('-')[0]?.trim(),
      artist: path.parse(file).name.split('-')[1]?.trim() ?? 'Unknown',
      path: path.join(filepath, file),
    }));
  }
}

export function getFolders(folder) {
  const items = fs.readdirSync(folder, { withFileTypes: true });
  return items.filter((item) => item.isDirectory()).map((dir) => path.join(folder, dir.name));
}
