import fs from 'fs';
import path from 'node:path';

export function LoadSongs(folder) {
  const files = fs.readdirSync(folder);
  const mp3s = files.filter((file) => file.endsWith('.mp3'));
  return mp3s.map((file) => ({
    name: path.parse(file).name,
    path: path.join(folder, file),
  }));
}

export function getMp3Buffer(filePath) {
  return fs.readFileSync(filePath);
}
