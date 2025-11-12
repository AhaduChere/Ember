<template>
  <audio :src="audioSrc" @ended="onEnded" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata"></audio>
  <div class="w-screen h-24 bg-neutral-950 fixed bottom-0 border-t border-stone-800">
    <div v-show="musicState.CurrentState.value.State" class="text-white fixed left-2 bottom-4 flex items-center space-x-2">
      <img :src="Icons.logo" class="w-16 h-auto rounded select-none" />
      <span
        v-if="musicState.CurrentState.value.CurrentSong.name"
        class="truncate select-none whitespace-pre-line overflow-ellipsis w-[15vw]">
        {{ musicState.CurrentState.value.CurrentSong.name }}
        <template v-if="musicState.CurrentState.value.CurrentSong.artist">
          <br />
          <span class="text-sm text-gray-400">by {{ musicState.CurrentState.value.CurrentSong.artist }}</span>
        </template>
        <template v-else>
          <br />
          <span class="text-sm text-gray-400">by Unnamed Artist</span>
        </template>
      </span>
    </div>
    <div class="flex items-center justify-center mt-4 pb-1 w-full px-4">
      <span class="text-white truncate text-right max-w-[20%] flex-grow pr-2 select-none">
        {{ sliderValue || sliderValue == null ? '0:00' : sliderValue }}
      </span>
      <VueSlider
        v-model="sliderValue"
        class="focus:outline-none flex-none"
        tooltip="none"
        :height="4"
        :disabled="!musicState.CurrentState.value.State"
        :style="{ width: '40%' }"
        :min="0"
        :max="musicState.CurrentState.value.CurrentSong.rawseconds"
        :interval="1"
        :dot-size="hovering || dragging ? 10 : 0"
        :dot-style="{ backgroundColor: '#ea580c' }"
        :process-style="{ backgroundColor: '#ea580c' }"
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
        @drag-start="dragging = true"
        @drag-end="dragging = false"
        @change="onSliderChange" />
      <span class="text-white truncate text-left max-w-[20%] flex-grow pl-2 select-none">
        {{ musicState.CurrentState.value.CurrentSong.duration || '0:00' }}</span
      >
    </div>
    <div class="flex justify-center items-stretch mb-2">
      <img draggable="false" :src="currentLoopIcon" class="w-8 h-12 cursor-pointer select-none mr-2" @click="toggleLoop" />
      <img draggable="false" :src="Icons.skipPreviousIcon" class="w-12 h-12 cursor-pointer select-none mr-2" @click="playPrevious" />

      <button
        :disabled="!musicState.CurrentState.value.CurrentSong.name"
        class="w-12 h-12 flex items-center justify-center cursor-pointer"
        @click.stop="Playback">
        <img
          draggable="false"
          :src="musicState.CurrentState.value.IsPlaying ? Icons.pauseIcon : Icons.playIcon"
          class="w-12 h-12 select-none" />
      </button>

      <img draggable="false" :src="Icons.skipNextIcon" class="w-12 h-12 cursor-pointer select-none ml-2" @click="playNext" />
      <img draggable="false" :src="currentShuffleIcon" class="w-8 h-12 cursor-pointer select-none ml-2" @click="toggleShuffle" />
    </div>
  </div>
</template>

<script setup>
import VueSlider from 'vue-3-slider-component';
import Icons from '../composables/Icons.js';
import { ref, inject } from 'vue';

const musicState = inject('musicState');
const currentShuffleIcon = ref(Icons.shuffleOffIcon);
const currentLoopIcon = ref(Icons.notLoopIcon);
const dragging = ref(false);
const hovering = ref(false);
const sliderValue = ref(0);
const audioSrc = ref('');

if (!musicState) throw new Error('MusicState not provided!');

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && musicState.CurrentState.value.State) {
    Playback();
  }
});

function Playback() {
  musicState.togglePlayback();
}

const toggleLoop = () => {
  if (currentLoopIcon.value === Icons.notLoopIcon) {
    currentLoopIcon.value = Icons.loopIcon;
  } else if (currentLoopIcon.value === Icons.loopIcon) {
    currentLoopIcon.value = Icons.loopSingleIcon;
  } else {
    currentLoopIcon.value = Icons.notLoopIcon;
  }
};
const toggleShuffle = () => {
  currentShuffleIcon.value = currentShuffleIcon.value === Icons.shuffleOffIcon ? Icons.shuffleOnIcon : Icons.shuffleOffIcon;
};

function onSliderChange(val) {
  if (audioRef?.value) audioRef.value.currentTime = val;
}
</script>
