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

let audioRef = null;

export function setAudioRef(r) {
  audioRef = r;
}

export function setSongs(arr) {
  songs.value = arr;
}

export async function loadSong(index) {
  if (songs.value.length === 0) {
    audioSrc.value = '';
    return;
  }

  if (audioRef?.value) {
    audioRef.value.pause();
    audioRef.value.currentTime = 0;
  }
  const buffer = await window.electronAPI.getMp3Buffer(songs.value[index].path);
  const blob = new Blob([new Uint8Array(buffer)], { type: 'audio/mp3' });
  audioSrc.value = URL.createObjectURL(blob);
  sliderValue.value = 0;
  if (shouldAutoPlay.value) {
    try {
      await audioRef.value.play();
      isPlaying.value = true;
      currentPlayIcon.value = pauseIcon;
    } catch {}
  }
}

export function playNext() {
  if (songs.value.length === 0) return;
  if (isShuffling.value) {
    let next;
    do {
      next = Math.floor(Math.random() * songs.value.length);
    } while (next === currentSongIndex.value && songs.value.length > 1);
    currentSongIndex.value = next;
  } else if (loopMode.value === 2) {
  } else {
    currentSongIndex.value = (currentSongIndex.value + 1) % songs.value.length;
  }
  shouldAutoPlay.value = true;
  loadSong(currentSongIndex.value);
}

export function playPrevious() {
  if (songs.value.length === 0 || !audioRef?.value) return;

  if (audioRef.value.currentTime > 3 || (currentSongIndex.value === 0 && loopMode.value !== 1)) {
    audioRef.value.currentTime = 0;
    return;
  }

  currentSongIndex.value = (currentSongIndex.value - 1 + songs.value.length) % songs.value.length;
  shouldAutoPlay.value = true;
  loadSong(currentSongIndex.value);
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
  if (!audioRef?.value) return;
  if (isPlaying.value) {
    pauseAudio();
    shouldAutoPlay.value = false;
  } else {
    playAudio();
    shouldAutoPlay.value = true;
  }
}

export function toggleShuffle() {
  isShuffling.value = !isShuffling.value;
  currentShuffleIcon.value = isShuffling.value ? shuffleOnIcon : shuffleOffIcon;
}

export function toggleLoop() {
  loopMode.value = (loopMode.value + 1) % 3;
  if (loopMode.value === 0) {
    currentLoopIcon.value = notLoopIcon;
    if (audioRef?.value) audioRef.value.loop = false;
  } else if (loopMode.value === 1) {
    currentLoopIcon.value = loopIcon;
    if (audioRef?.value) audioRef.value.loop = false;
  } else if (loopMode.value === 2) {
    currentLoopIcon.value = loopSingleIcon;
    if (audioRef?.value) audioRef.value.loop = true;
  }
}

export function onEnded() {
  if (loopMode.value === 2) {
    playAudio();
  } else if (loopMode.value === 1) {
    playNext();
  } else if (isShuffling.value) {
    playNext();
  } else {
    isPlaying.value = false;
    currentPlayIcon.value = playIcon;
  }
}

export function onTimeUpdate() {
  if (audioRef?.value) {
    sliderValue.value = audioRef.value.currentTime;
  }
}

export function onLoadedMetadata() {
  if (audioRef?.value) {
    duration.value = Math.floor(audioRef.value.duration || 0);
    if (shouldAutoPlay.value) {
      playAudio();
      shouldAutoPlay.value = false;
    }
  }
}

export function onSliderChange(val) {
  if (audioRef?.value) {
    audioRef.value.currentTime = val;
  }
}

export function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}
