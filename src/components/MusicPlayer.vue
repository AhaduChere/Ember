<template>
  <audio :src="audioSrc" controls></audio>
  <div class="w-screen h-25 bg-neutral-950 fixed bottom-0">
    <div class="flex items-center justify-center mt-5 pb-2">
      <VueSlider
        id="Slider"
        v-model="sliderValue"
        class="focus:outline-none"
        :height="4"
        :width="600"
        :min="0"
        :max="100"
        tooltip="none"
        :dot-size="10"
        :dot-style="{ backgroundColor: '#ea580c' }"
        :process-style="{ backgroundColor: '#ea580c' }"
        :contained="true"
        :use-keyboard="false" />
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
          style="pointer-events: auto" />

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
          style="pointer-events: auto" />

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
import { folder } from '../composables/Folder';
import { ref, onMounted } from 'vue';

let audioSrc = ref('');

onMounted(async () => {
  const firstmp3 = await window.electronAPI.LoadSongs(folder.value);
  if (firstmp3) {
    const buffer = await window.electronAPI.getMp3Buffer(firstmp3);
    const blob = new Blob([new Uint8Array(buffer)], { type: 'audio/mp3' });
    audioSrc.value = URL.createObjectURL(blob);
  } else {
    audioSrc.value = '';
  }
});

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

const sliderValue = ref(0);
const currentPlayIcon = ref(playIcon);
const currentShuffleIcon = ref(shuffleOffIcon);
const currentLoopIcon = ref(notLoopIcon);
const playbackState = ref(0);

const togglePlayback = () => {
  if (playbackState.value === 0 || playbackState.value === 1) {
    playbackState.value = 2;
    currentPlayIcon.value = pauseIcon;
  } else if (playbackState.value === 2) {
    playbackState.value = 1;
    currentPlayIcon.value = playIcon;
  }
};

const toggleShuffle = () => {
  currentShuffleIcon.value = currentShuffleIcon.value === shuffleOffIcon ? shuffleOnIcon : shuffleOffIcon;
};

const toggleLoop = () => {
  if (currentLoopIcon.value === notLoopIcon) {
    currentLoopIcon.value = loopIcon;
  } else if (currentLoopIcon.value === loopIcon) {
    currentLoopIcon.value = loopSingleIcon;
  } else {
    currentLoopIcon.value = notLoopIcon;
  }
};
</script>
