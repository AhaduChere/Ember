<template>
  <audio ref="audioRef" :src="audioSrc" @ended="onEnded" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata"></audio>
  <div class="w-screen h-24 bg-neutral-950 fixed bottom-0">
    <div class="text-white fixed left-2 bottom-4 flex items-center space-x-2">
      <img :src="Icon" class="w-16 h-16 rounded select-none" />
      <span class="truncate select-none whitespace-pre-line overflow-ellipsis w-[16vw]">
        {{ (nowPlaying?.name || '').split('-')[0] }}
        <template v-if="(nowPlaying?.name || '').includes('-')">
          <br />
          <span class="text-sm text-gray-400"> by {{ (nowPlaying?.name || '').split('-').slice(1).join('-') }} </span>
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
        :disabled="sliderValue == 0"
        :height="4"
        :style="{ width: '40%' }"
        :min="0"
        :max="duration"
        :interval="1"
        tooltip="none"
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
      <img :src="currentLoopIcon" class="w-8 h-12 cursor-pointer select-none mr-2" @click="toggleLoop" />
      <img :src="skipPreviousIcon" class="w-12 h-12 cursor-pointer select-none mr-2" @click="playPrevious" />
      <img :src="currentPlayIcon" class="w-12 h-12 cursor-pointer select-none" @click="togglePlayback" />
      <img :src="skipNextIcon" class="w-12 h-12 cursor-pointer select-none ml-2" @click="playNext" />
      <img :src="currentShuffleIcon" class="w-8 h-12 cursor-pointer select-none ml-2" @click="toggleShuffle" />
    </div>
    <div class="fixed right-2 bottom-8 flex items-center w-[20vw] max-w-70">
      <img :src="volume === 0 ? audioOff : audioOn" class="w-8 h-auto rounded select-none mr-3" />
      <VueSlider
        v-model="volume"
        :min="0"
        :max="100"
        :height="6"
        :dot-size="14"
        :process-style="{ backgroundColor: '#ea580c' }"
        :rail-style="{ backgroundColor: '#4B5563' }"
        :tooltip="'none'"
        class="flex-1 mr-4" />
    </div>
  </div>
</template>

<script setup>
import VueSlider from 'vue-3-slider-component';
import { ref, onMounted, watch } from 'vue';
import { skipNextIcon, skipPreviousIcon, audioOn, audioOff } from '../composables/Icons.js';
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
} from '../composables/Songs.js';

const audioRef = ref(null);
const hovering = ref(false);
const dragging = ref(false);
const volume = ref(50);

onMounted(() => {
  setAudioRef(audioRef);
  setup();
  window.addEventListener('keydown', (e) => e.code === 'Space' && togglePlayback());
});

watch(volume, (val) => {
  if (audioRef.value) audioRef.value.volume = val / 100;
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
