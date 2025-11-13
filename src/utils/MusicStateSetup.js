import { app, dialog } from 'electron';
import { parseFile } from 'music-metadata';
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
  const folder = filepath.endsWith('.mp3') ? path.dirname(filepath) : filepath;
  const files = fs.readdirSync(folder);
  const mp3s = files.filter((file) => file.endsWith('.mp3'));
  return Promise.all(
    mp3s.map(async (file) => {
      const filePath = path.join(folder, file);
      const metadata = await parseFile(filePath);
      const durationSec = Math.floor(metadata.format.duration || 0);
      const minutes = Math.floor(durationSec / 60);
      const seconds = durationSec % 60;
      const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      return {
        name: path.parse(file).name.split('|')[0]?.trim(),
        artist: path.parse(file).name.split('|')[1]?.trim() ?? 'Unknown',
        path: filePath,
        duration: formattedDuration,
        rawseconds: durationSec,
      };
    })
  );
}

export function getFolders(folder) {
  const items = fs.readdirSync(folder, { withFileTypes: true });
  return items.filter((item) => item.isDirectory()).map((dir) => path.join(folder, dir.name));
}
