import { app } from 'electron';

export function IsFolderThere() {
  // const musicPath = app.getPath('music');
  const musicPath = null;
  if (musicPath == null) {
    return false;
  } else {
    return true;
  }
}
