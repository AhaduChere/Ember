import fs from 'fs';
import path from 'node:path';

export function LoadSongs(folder) {
  const files = fs.readdirSync(folder);
  const mp3 = files.find((file) => file.endsWith('.mp3'));
  return mp3 ? path.join(folder, mp3) : null;
}

export function getMp3Buffer(filePath) {
  return fs.readFileSync(filePath);
}
