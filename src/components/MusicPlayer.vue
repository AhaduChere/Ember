<template>
  <div></div>
  <!-- <audio ref="audioRef" :src="audioSrc" @ended="onEnded" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata"></audio> -->
  <!-- <div class="w-screen h-24 bg-neutral-950 fixed bottom-0 border-t border-stone-800"> -->
  <!--   <div v-show="nowPlaying" class="text-white fixed left-2 bottom-4 flex items-center space-x-2"> -->
  <!--     <img :src="Icon" class="w-16 h-auto rounded select-none" /> -->
  <!--     <span v-if="nowPlaying?.name" class="truncate select-none whitespace-pre-line overflow-ellipsis w-[15vw]"> -->
  <!--       {{ nowPlaying.name.split('-')[0] }} -->
  <!--       <template v-if="nowPlaying.name.includes('-')"> -->
  <!--         <br /> -->
  <!--         <span class="text-sm text-gray-400">by {{ nowPlaying.name.split('-').slice(1).join('-').trim() }}</span> -->
  <!--       </template> -->
  <!--       <template v-else> -->
  <!--         <br /> -->
  <!--         <span class="text-sm text-gray-400">by Unnamed Artist</span> -->
  <!--       </template> -->
  <!--     </span> -->
  <!--   </div> -->
  <!--   <div class="flex items-center justify-center mt-4 pb-1 w-full px-4"> -->
  <!--     <span class="text-white truncate text-right max-w-[20%] flex-grow pr-2 select-none"> -->
  <!--       {{ isNaN(sliderValue) || sliderValue == null ? '0:00' : formatTime(sliderValue) }} -->
  <!--     </span> -->
  <!--     <VueSlider -->
  <!--       v-model="sliderValue" -->
  <!--       class="focus:outline-none flex-none" -->
  <!--       tooltip="none" -->
  <!--       :disabled="!nowPlaying" -->
  <!--       :height="4" -->
  <!--       :style="{ width: '40%' }" -->
  <!--       :min="0" -->
  <!--       :max="duration" -->
  <!--       :interval="1" -->
  <!--       :dot-size="hovering || dragging ? 10 : 0" -->
  <!--       :dot-style="{ backgroundColor: '#ea580c' }" -->
  <!--       :process-style="{ backgroundColor: '#ea580c' }" -->
  <!--       @mouseenter="hovering = true" -->
  <!--       @mouseleave="hovering = false" -->
  <!--       @drag-start="dragging = true" -->
  <!--       @drag-end="dragging = false" -->
  <!--       @change="onSliderChange" /> -->
  <!--     <span class="text-white truncate text-left max-w-[20%] flex-grow pl-2 select-none">{{ formatTime(duration) }}</span> -->
  <!--   </div> -->
  <!--   <div class="flex justify-center items-stretch mb-2"> -->
  <!--     <img draggable="false" :src="currentLoopIcon" class="w-8 h-12 cursor-pointer select-none mr-2" @click="toggleLoop" /> -->
  <!--     <img draggable="false" :src="skipPreviousIcon" class="w-12 h-12 cursor-pointer select-none mr-2" @click="playPrevious" /> -->
  <!--     <img draggable="false" :src="currentPlayIcon" class="w-12 h-12 cursor-pointer select-none" @click="togglePlayback" /> -->
  <!--     <img draggable="false" :src="skipNextIcon" class="w-12 h-12 cursor-pointer select-none ml-2" @click="playNext" /> -->
  <!--     <img draggable="false" :src="currentShuffleIcon" class="w-8 h-12 cursor-pointer select-none ml-2" @click="toggleShuffle" /> -->
  <!--   </div> -->
  <!-- </div> -->
</template>

<script setup>
import VueSlider from 'vue-3-slider-component';
import Icon from '../assets/Icon.png';
import { ref, onMounted, inject } from 'vue';

const playbackState = ref(0);
const sliderValue = ref(0);

onMounted(() => {
  const musicState = inject('musicState');
  if (!musicState) {
    throw new Error('MusicState not provided!');
  }
});

const togglePlayback = () => {
  if (playbackState.value === 0 || playbackState.value === 1) {
    playbackState.value = 2;

    currentPlayIcon.value = pauseIcon;
  } else if (playbackState.value === 2) {
    playbackState.value = 1;

    currentPlayIcon.value = playIcon;
  }
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
const toggleShuffle = () => {
  currentShuffleIcon.value = currentShuffleIcon.value === shuffleOffIcon ? shuffleOnIcon : shuffleOffIcon;
};

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}
</script>
