<template>
  <audio ref="audioRef" :src="audioSrc" @ended="onEnded" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata"></audio>
  <div class="w-screen h-25 bg-neutral-950 fixed bottom-0">
    <div class="flex items-center justify-center mt-5 pb-2">
      <VueSlider
        id="Slider"
        v-model="sliderValue"
        class="focus:outline-none"
        :height="4"
        :width="600"
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
    <div class="flex justify-center mt-2">
      <ul>
        <li v-for="(song, idx) in songs" :key="song.path" :class="{ 'text-orange-500': idx === currentSongIndex }">
          {{ song.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import VueSlider from 'vue-3-slider-component';
import { folder } from '../composables/Folder';
import { ref, onMounted, watch } from 'vue';

const shouldAutoPlay = ref(false);
let audioSrc = ref('');
let songs = ref([]);
let currentSongIndex = ref(0);
let isPlaying = ref(false);
let isShuffling = ref(false);
let loopMode = ref(0);
let duration = ref(100);
let sliderValue = ref(0);
const audioRef = ref(null);

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

onMounted(async () => {
  songs.value = await window.electronAPI.LoadSongs(folder.value);
  if (songs.value.length > 0) {
    await loadSong(currentSongIndex.value);
  } else {
    audioSrc.value = '';
  }
});

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
  shouldAutoPlay.value = true;
}

function playNext() {
  pauseAudio();
  if (songs.value.length === 0) return;
  if (isShuffling.value) {
    let next;
    do {
      next = Math.floor(Math.random() * songs.value.length);
    } while (next === currentSongIndex.value && songs.value.length > 1);
    currentSongIndex.value = next;
  } else if (loopMode.value === 2) {
    // loop one
    // do nothing, will be handled by audio element
  } else {
    currentSongIndex.value = (currentSongIndex.value + 1) % songs.value.length;
  }
  loadSong(currentSongIndex.value);
}

function playPrevious() {
  pauseAudio();
  if (songs.value.length === 0) return;
  if (isShuffling.value) {
    let prev;
    do {
      prev = Math.floor(Math.random() * songs.value.length);
    } while (prev === currentSongIndex.value && songs.value.length > 1);
    currentSongIndex.value = prev;
  } else {
    currentSongIndex.value = (currentSongIndex.value - 1 + songs.value.length) % songs.value.length;
  }
  loadSong(currentSongIndex.value);
  playAudio();
}

async function playAudio() {
  if (audioRef.value) {
    try {
      await audioRef.value.play();
      isPlaying.value = true;
      currentPlayIcon.value = pauseIcon;
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error(e);
      }
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
  } else {
    playAudio();
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
</script>
