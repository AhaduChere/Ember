<template>
  <audio ref="audioRef" :src="audioSrc" @ended="onEnded" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata"></audio>
  <div class="w-screen h-24 bg-neutral-950 fixed bottom-0 border-t border-stone-800">
    <div v-show="nowPlaying" class="text-white fixed left-2 bottom-4 flex items-center space-x-2">
      <img :src="Icon" class="w-16 h-auto rounded select-none" />
      <span v-if="nowPlaying?.name" class="truncate select-none whitespace-pre-line overflow-ellipsis w-[15vw]">
        {{ nowPlaying.name.split('-')[0] }}
        <template v-if="nowPlaying.name.includes('-')">
          <br />
          <span class="text-sm text-gray-400">by {{ nowPlaying.name.split('-').slice(1).join('-').trim() }}</span>
        </template>
        <template v-else>
          <br />
          <span class="text-sm text-gray-400">by Unnamed Artist</span>
        </template>
      </span>
    </div>
    <div class="flex items-center justify-center mt-4 pb-1 w-full px-4">
      <span class="text-white truncate text-right max-w-[20%] flex-grow pr-2 select-none">
        {{ isNaN(sliderValue) || sliderValue == null ? '0:00' : formatTime(sliderValue) }}
      </span>
      <VueSlider
        v-model="sliderValue"
        class="focus:outline-none flex-none"
        tooltip="none"
        :disabled="!nowPlaying"
        :height="4"
        :style="{ width: '40%' }"
        :min="0"
        :max="duration"
        :interval="1"
        :dot-size="hovering || dragging ? 10 : 0"
        :dot-style="{ backgroundColor: '#ea580c' }"
        :process-style="{ backgroundColor: '#ea580c' }"
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
        @drag-start="dragging = true"
        @drag-end="dragging = false"
        @change="onSliderChange" />
      <span class="text-white truncate text-left max-w-[20%] flex-grow pl-2 select-none">{{ formatTime(duration) }}</span>
    </div>
    <div class="flex justify-center items-stretch mb-2">
      <img draggable="false" :src="currentLoopIcon" class="w-8 h-12 cursor-pointer select-none mr-2" @click="toggleLoop" />
      <img draggable="false" :src="skipPreviousIcon" class="w-12 h-12 cursor-pointer select-none mr-2" @click="playPrevious" />
      <img draggable="false" :src="currentPlayIcon" class="w-12 h-12 cursor-pointer select-none" @click="togglePlayback" />
      <img draggable="false" :src="skipNextIcon" class="w-12 h-12 cursor-pointer select-none ml-2" @click="playNext" />
      <img draggable="false" :src="currentShuffleIcon" class="w-8 h-12 cursor-pointer select-none ml-2" @click="toggleShuffle" />
    </div>
  </div>
</template>

<script setup>
import VueSlider from 'vue-3-slider-component';
import { ref, onMounted, watch } from 'vue';
import { skipNextIcon, skipPreviousIcon } from '../composables/Icons.js';
import Icon from '../assets/Icon.png';
import {
  currentSongIndex,
  audioSrc,
  loadSong,
  setSongs,
  setAudioRef,
  currentLoopIcon,
  currentPlayIcon,
  currentShuffleIcon,
  isPlaying,
  duration,
  playNext,
  playPrevious,
  togglePlayback,
  toggleShuffle,
  toggleLoop,
  onEnded,
  onTimeUpdate,
  onLoadedMetadata,
  onSliderChange,
  sliderValue,
  folder,
  folders,
  nowPlaying,
  volume,
} from '../composables/Songs.js';

const audioRef = ref(null);
const hovering = ref(false);
const dragging = ref(false);

onMounted(() => {
  setAudioRef(audioRef);
  setup();
  window.addEventListener('keydown', (e) => e.code === 'Space' && togglePlayback());
});

watch(volume, (val) => {
  if (audioRef.value) audioRef.value.volume = val / 120; //feels more accurate then 100
});

async function setup() {
  const allFolders = await window.electronAPI.getFolders(folder.value);
  if (allFolders.length > 0) folders.value = [folder.value, ...allFolders.filter((f) => f !== folder.value)];

  const loadedSongs = await window.electronAPI.LoadSongs(folder.value);
  setSongs(loadedSongs);

  if (loadedSongs.length > 0 && loadedSongs[currentSongIndex.value]) {
    await loadSong(currentSongIndex.value);
  } else {
    audioSrc.value = '';
  }
}

watch(audioSrc, async () => {
  if (!audioRef.value) return;
  audioRef.value.load();
  if (isPlaying.value)
    try {
      await audioRef.value.play();
    } catch {}
});

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}
</script>
