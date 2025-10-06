<template>
  <audio ref="audioRef" :src="audioSrc" @ended="onEnded" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata"></audio>
  <div class="w-screen h-25 bg-neutral-950 fixed bottom-0">
    <div class="flex items-center justify-center mt-4 pb-1 w-full px-4">
      <span class="text-white truncate text-right max-w-[20%] flex-grow pr-2 select-none">{{ songs[currentSongIndex]?.name || '' }}</span>
      <VueSlider
        v-model="sliderValue"
        class="focus:outline-none flex-none"
        :height="4"
        :style="{ width: '40%' }"
        :min="0"
        :max="duration"
        :interval="1"
        tooltip="none"
        :dot-size="10"
        :dot-style="{ backgroundColor: '#ea580c' }"
        :process-style="{ backgroundColor: '#ea580c' }"
        :contained="true"
        :use-keyboard="false"
        @change="onSliderChange" />
      <span class="text-white truncate text-left max-w-[20%] flex-grow pl-2 select-none"
        >{{ formatTime(sliderValue) }}/{{ formatTime(duration) }}</span
      >
    </div>

    <div class="contents">
      <div class="flex justify-center items-stretch">
        <img
          draggable="false"
          :src="currentLoopIcon"
          alt="LoopButton"
          class="w-8 h-12 cursor-pointer hover:brightness-[0.90] object-contain select-none mr-2"
          style="pointer-events: auto"
          @click="toggleLoop" />
        <img
          draggable="false"
          :src="skipPreviousIcon"
          alt="PreviousButton"
          class="w-12 h-12 cursor-pointer hover:brightness-[0.90] active:mt-[0.5px] object-contain select-none mr-2"
          style="pointer-events: auto"
          @click="playPrevious" />
        <img
          draggable="false"
          :src="currentPlayIcon"
          alt="PlaybackButton"
          class="w-12 h-12 cursor-pointer hover:brightness-[0.90] active:mt-[0.5px] object-contain select-none"
          style="pointer-events: auto"
          @click="togglePlayback" />
        <img
          draggable="false"
          :src="skipNextIcon"
          alt="SkipButton"
          class="w-12 h-12 cursor-pointer hover:brightness-[0.90] active:mt-[0.5px] object-contain select-none ml-2"
          style="pointer-events: auto"
          @click="playNext" />
        <img
          draggable="false"
          :src="currentShuffleIcon"
          alt="ShuffleButton"
          class="w-8 h-12 cursor-pointer hover:brightness-[0.90] object-contain select-none ml-2"
          style="pointer-events: auto"
          @click="toggleShuffle" />
      </div>
    </div>
  </div>
</template>

<script setup>
import VueSlider from 'vue-3-slider-component';
import { ref, onMounted, watch } from 'vue';
import { folder } from '../composables/Folder.js';
import { skipNextIcon, skipPreviousIcon } from '../composables/Icons.js';
import {
  songs,
  currentSongIndex,
  audioSrc,
  sliderValue,
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
  formatTime,
} from '../composables/Songs.js';

const audioRef = ref(null);

onMounted(() => {
  setAudioRef(audioRef);
  setup();
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      togglePlayback();
    }
  });
});

async function setup() {
  setSongs(await window.electronAPI.LoadSongs(folder.value));
  if (songs.value.length > 0) {
    await loadSong(currentSongIndex.value);
  } else {
    audioSrc.value = '';
  }
}

watch(audioSrc, async () => {
  if (audioRef.value) {
    audioRef.value.load();
    if (isPlaying.value) {
      try {
        await audioRef.value.play();
      } catch {}
    }
  }
});
</script>
