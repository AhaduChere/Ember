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
import { songs, currentSongIndex, setSongs } from '../composables/Songs.js';
import {
  playIcon,
  pauseIcon,
  skipNextIcon,
  skipPreviousIcon,
  notLoopIcon,
  loopIcon,
  loopSingleIcon,
  shuffleOffIcon,
  shuffleOnIcon,
} from '../composables/Icons.js';

const currentPlayIcon = ref(playIcon);
const currentShuffleIcon = ref(shuffleOffIcon);
const currentLoopIcon = ref(notLoopIcon);
let audioSrc = ref('');
const shouldAutoPlay = ref(false);
let isPlaying = ref(false);
let isShuffling = ref(false);
let loopMode = ref(0);
let duration = ref(100);
let sliderValue = ref(0);
const audioRef = ref(null);

onMounted(() => {
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
      await audioRef.value.play();
    }
  }
});

async function loadSong(index) {
  if (songs.value.length === 0) {
    audioSrc.value = '';
    return;
  }
  const buffer = await window.electronAPI.getMp3Buffer(songs.value[index].path);
  const blob = new Blob([new Uint8Array(buffer)], { type: 'audio/mp3' });
  audioSrc.value = URL.createObjectURL(blob);
  sliderValue.value = 0;
}

function playNext() {
  if (songs.value.length === 0) return;
  if (isShuffling.value) {
    let next;
    do {
      next = Math.floor(Math.random() * songs.value.length);
    } while (next === currentSongIndex.value && songs.value.length > 1);
    currentSongIndex.value = next;
  } else if (loopMode.value === 2) {
    // loop single
  } else {
    currentSongIndex.value = (currentSongIndex.value + 1) % songs.value.length;
  }
  shouldAutoPlay.value = true;
  loadSong(currentSongIndex.value);
}

function playPrevious() {
  if (songs.value.length === 0 || !audioRef.value) return;

  if (audioRef.value.currentTime > 3 || currentSongIndex.value === 0) {
    audioRef.value.currentTime = 0;
    return;
  }

  currentSongIndex.value = (currentSongIndex.value - 1 + songs.value.length) % songs.value.length;
  shouldAutoPlay.value = true;
  loadSong(currentSongIndex.value);
}

async function playAudio() {
  if (audioRef.value) {
    try {
      await audioRef.value.play();
      isPlaying.value = true;
      currentPlayIcon.value = pauseIcon;
    } catch {
      isPlaying.value = false;
      currentPlayIcon.value = playIcon;
    }
  }
}

function pauseAudio() {
  if (audioRef.value) {
    audioRef.value.pause();
    isPlaying.value = false;
    currentPlayIcon.value = playIcon;
  }
}

function togglePlayback() {
  if (!audioRef.value) return;
  if (isPlaying.value) {
    pauseAudio();
    shouldAutoPlay.value = false;
  } else {
    playAudio();
    shouldAutoPlay.value = true;
  }
}

function toggleShuffle() {
  isShuffling.value = !isShuffling.value;
  currentShuffleIcon.value = isShuffling.value ? shuffleOnIcon : shuffleOffIcon;
}

function toggleLoop() {
  loopMode.value = (loopMode.value + 1) % 3;
  if (loopMode.value === 0) {
    currentLoopIcon.value = notLoopIcon;
    if (audioRef.value) audioRef.value.loop = false;
  } else if (loopMode.value === 1) {
    currentLoopIcon.value = loopIcon;
    if (audioRef.value) audioRef.value.loop = false;
  } else if (loopMode.value === 2) {
    currentLoopIcon.value = loopSingleIcon;
    if (audioRef.value) audioRef.value.loop = true;
  }
}

function onEnded() {
  if (loopMode.value === 2) {
    // loop one
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

function onTimeUpdate() {
  if (audioRef.value) {
    sliderValue.value = audioRef.value.currentTime;
  }
}

function onLoadedMetadata() {
  if (audioRef.value) {
    duration.value = Math.floor(audioRef.value.duration || 0);
    if (shouldAutoPlay.value) {
      playAudio();
      shouldAutoPlay.value = false;
    }
  }
}

function onSliderChange(val) {
  if (audioRef.value) {
    audioRef.value.currentTime = val;
  }
}
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}
</script>
