import { ref } from 'vue';
import { playIcon, pauseIcon, notLoopIcon, loopIcon, loopSingleIcon, shuffleOffIcon, shuffleOnIcon } from './Icons.js';

export const songs = ref([]);
export const currentSongIndex = ref(0);
export const audioSrc = ref('');
export const sliderValue = ref(0);
export const isPlaying = ref(false);
export const isShuffling = ref(false);
export const loopMode = ref(0);
export const duration = ref(0);
export const shouldAutoPlay = ref(false);
export const currentPlayIcon = ref(playIcon);
export const currentShuffleIcon = ref(shuffleOffIcon);
export const currentLoopIcon = ref(notLoopIcon);
export const folder = ref(null);
export const folders = ref([]);
export const nowPlaying = ref(null);
export const activePlaylist = ref([]);

let audioRef = null;
export const volume = ref(50);

export function setAudioRef(r) {
  audioRef = r;
}

export function setSongs(arr) {
  songs.value = arr;
}

export async function loadSong(index, playlist = songs.value) {
  if (!playlist.length) {
    audioSrc.value = '';
    return;
  }

  if (audioRef?.value) {
    audioRef.value.pause();
    audioRef.value.currentTime = 0;
  }

  const buffer = await window.electronAPI.getMp3Buffer(playlist[index].path);
  audioSrc.value = URL.createObjectURL(new Blob([new Uint8Array(buffer)], { type: 'audio/mp3' }));
  sliderValue.value = 0;
  nowPlaying.value = playlist[index];

  if (shouldAutoPlay.value) {
    try {
      await audioRef.value.play();
      isPlaying.value = true;
      currentPlayIcon.value = pauseIcon;
    } catch {}
  }
}

export async function playAudio() {
  if (!audioRef?.value) return;
  try {
    await audioRef.value.play();
    isPlaying.value = true;
    currentPlayIcon.value = pauseIcon;
  } catch {
    isPlaying.value = false;
    currentPlayIcon.value = playIcon;
  }
}
export function pauseAudio() {
  if (!audioRef?.value) return;
  audioRef.value.pause();
  isPlaying.value = false;
  currentPlayIcon.value = playIcon;
}

export function togglePlayback() {
  isPlaying.value ? pauseAudio() : playAudio();
  shouldAutoPlay.value = isPlaying.value;
}
export function toggleShuffle() {
  isShuffling.value = !isShuffling.value;
  currentShuffleIcon.value = isShuffling.value ? shuffleOnIcon : shuffleOffIcon;
}
export function toggleLoop() {
  loopMode.value = (loopMode.value + 1) % 3;
  currentLoopIcon.value = loopMode.value === 0 ? notLoopIcon : loopMode.value === 1 ? loopIcon : loopSingleIcon;
  if (audioRef?.value) audioRef.value.loop = loopMode.value === 2;
}

export function playNext() {
  if (!activePlaylist.value.length) return;
  currentSongIndex.value = isShuffling.value
    ? Math.floor(Math.random() * activePlaylist.value.length)
    : (currentSongIndex.value + 1) % activePlaylist.value.length;
  shouldAutoPlay.value = true;
  loadSong(currentSongIndex.value, activePlaylist.value);
}

export function playPrevious() {
  if (!activePlaylist.value.length || !audioRef?.value) return;
  if (audioRef.value.currentTime > 3) {
    audioRef.value.currentTime = 0;
    return;
  }
  currentSongIndex.value = isShuffling.value
    ? Math.floor(Math.random() * activePlaylist.value.length)
    : (currentSongIndex.value - 1 + activePlaylist.value.length) % activePlaylist.value.length;
  shouldAutoPlay.value = true;
  loadSong(currentSongIndex.value, activePlaylist.value);
}

export function onEnded() {
  (loopMode.value === 2 ? playAudio() : loopMode.value === 1 || isShuffling.value ? playNext() : (isPlaying.value = false),
    (currentPlayIcon.value = playIcon));
}
export function onTimeUpdate() {
  if (audioRef?.value) sliderValue.value = audioRef.value.currentTime;
}
export function onLoadedMetadata() {
  if (audioRef?.value) {
    duration.value = Math.floor(audioRef.value.duration || 0);
    if (shouldAutoPlay.value) (playAudio(), (shouldAutoPlay.value = false));
  }
}
export function onSliderChange(val) {
  if (audioRef?.value) audioRef.value.currentTime = val;
}
