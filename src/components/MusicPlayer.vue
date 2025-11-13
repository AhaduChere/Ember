<template>
  <audio
    :ref="musicState.audioRef"
    :src="musicState.audioSrc.value"
    class="absolute top-0 right-0 z-50"
    @ended="onEnded"
    @timeupdate="onTimeUpdate"
    @loadedmetadata="onLoadedMetadata"></audio>
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
        {{ !musicState.CurrentState.value.State ? '0:00' : formatTime(sliderValue) }}
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
      <button
        :disabled="!musicState.CurrentState.value.CurrentSong.name"
        :class="!musicState.CurrentState.value.CurrentSong.name ? 'cursor-not-allowed' : 'cursor-pointer'"
        class="w-8 h-12 mr-2 flex items-center justify-center"
        @click.stop="musicState.toggleLoop()">
        <img
          draggable="false"
          :src="
            musicState.loopMode.value === 0 ? Icons.notLoopIcon : musicState.loopMode.value === 1 ? Icons.loopIcon : Icons.loopSingleIcon
          "
          class="w-8 h-12 select-none" />
      </button>

      <button
        :disabled="!musicState.CurrentState.value.CurrentSong.name"
        :class="!musicState.CurrentState.value.CurrentSong.name ? 'cursor-not-allowed' : 'cursor-pointer'"
        class="w-12 h-12 mr-2 flex items-center justify-center"
        @click="playPrevious">
        <img draggable="false" :src="Icons.skipPreviousIcon" class="w-12 h-12 select-none" />
      </button>

      <button
        :disabled="!musicState.CurrentState.value.CurrentSong.name"
        :class="!musicState.CurrentState.value.CurrentSong.name ? 'cursor-not-allowed' : 'cursor-pointer'"
        class="w-12 h-12 flex items-center justify-center"
        @click.stop="musicState.togglePlayback()">
        <img draggable="false" :src="musicState.IsPlaying.value ? Icons.pauseIcon : Icons.playIcon" class="w-12 h-12 select-none" />
      </button>

      <button
        :disabled="!musicState.CurrentState.value.CurrentSong.name"
        :class="!musicState.CurrentState.value.CurrentSong.name ? 'cursor-not-allowed' : 'cursor-pointer'"
        class="w-12 h-12 ml-2 flex items-center justify-center"
        @click="playNext()">
        <img draggable="false" :src="Icons.skipNextIcon" class="w-12 h-12 select-none" />
      </button>

      <button
        :disabled="!musicState.CurrentState.value.CurrentSong.name"
        :class="!musicState.CurrentState.value.CurrentSong.name ? 'cursor-not-allowed' : 'cursor-pointer'"
        class="w-8 h-12 ml-2 flex items-center justify-center"
        @click.stop="musicState.toggleShuffle()">
        <img
          draggable="false"
          :src="musicState.shuffleMode.value ? Icons.shuffleOnIcon : Icons.shuffleOffIcon"
          class="w-8 h-12 select-none" />
      </button>
    </div>
    <div class="absolute bottom-0 right-0 -mt-14 w-20">
      <img draggable="false" :src="volume === 0 ? Icons.audioOff : Icons.audioOn" class="w-8 h-auto select-none" />
      <VueSlider
        v-model="volume"
        :min="0"
        :max="100"
        :height="4"
        :dot-size="10"
        :process-style="{ backgroundColor: '#ea580c' }"
        :rail-style="{ backgroundColor: '#4B5563' }"
        :tooltip="'none'" />
    </div>
  </div>
</template>

<script setup>
import VueSlider from 'vue-3-slider-component';
import Icons from '../composables/Icons.js';
import { ref, inject } from 'vue';

const dragging = ref(false);
const hovering = ref(false);
const sliderValue = ref(0);
const volume = ref(0);

const musicState = inject('musicState');
if (!musicState) throw new Error('MusicState not provided!');

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && musicState.CurrentState.value.State) {
    musicState.togglePlayback();
  }
});

function onSliderChange(val) {
  if (musicState.audioRef?.value) musicState.audioRef.value.currentTime = val;
}

async function onEnded() {
  if (musicState.loopMode.value == 0) {
    musicState.audioRef.value.currentTime = 0;
    musicState.IsPlaying.value = false;
  } else if (musicState.loopMode.value == 1) {
    let nextSong = await musicState.getNextSong();
    await musicState.updateCurrentState(nextSong);
    await musicState.getMP3();
    musicState.audioRef.value.play();
  } else {
    musicState.audioRef.value.currentTime = 0;
    musicState.audioRef.value.play();
  }
}

async function playNext() {
  let nextSong = await musicState.getNextSong();
  await musicState.updateCurrentState(nextSong);
  await musicState.getMP3();
  musicState.audioRef.value.currentTime = 0;
  if (musicState.loopMode.value == 1 || musicState.loopMode.value == 2) {
    musicState.audioRef.value.play();
    musicState.IsPlaying.value = true;
  } else {
    musicState.audioRef.value.pause();
    musicState.IsPlaying.value = false;
  }
}

async function playPrevious() {
  if (musicState.audioRef.value.currentTime > 5 || musicState.loopMode.value == 0 || musicState.loopMode.value == 2) {
    musicState.audioRef.value.currentTime = 0;
  } else {
    let prevSong = await musicState.getPreviousSong();
    await musicState.updateCurrentState(prevSong);
    await musicState.getMP3();
    musicState.audioRef.value.play();
  }
}

function onTimeUpdate() {
  sliderValue.value = Math.floor(musicState.audioRef.value.currentTime || 0);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}
</script>
