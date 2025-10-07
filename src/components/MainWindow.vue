<template>
  <div class="bg-[#121212] text-white min-h-screen">
    <main class="grid grid-cols-5 lg:grid-cols-6 overflow-clip">
      <section class="col-span-1 border-r-4 border-stone-700 p-4">
        <div class="grid grid-cols-1 gap-2">
          <div
            v-for="folder in folders"
            :key="folder"
            class="bg-[#1f1f1f] w-full mx-auto hover:bg-[#2a2a2a] p-8 rounded-lg truncate cursor-pointer select-none flex justify-center items-center">
            {{ folder.split('/').pop() }}
          </div>
        </div>
      </section>
      <section class="col-span-4 lg:col-span-5 h-svh overflow-y-auto overflow-x-hidden">
        <div class="h-48 border-b-4 border-stone-700">
          <div>Name of Current playlist will go here</div>
        </div>
        <div class="grid grid-cols-1 gap-4 mt-6 px-5">
          <div
            v-for="(song, index) in songs"
            :key="song.name"
            class="bg-[#1f1f1f] hover:bg-[#2a2a2a] p-4 rounded-lg flex items-center justify-between transition">
            <span
              :class="[
                'text-lg truncate select-none justify-center',
                currentSongIndex === index ? 'text-[#ea580c] font-extrabold' : 'font-extralight text-white',
              ]">
              {{ song.name.replace(/\.mp3$/, ' ') }}
            </span>
            <img
              draggable="false"
              :src="currentSongIndex === index && isPlaying ? pauseIcon : playIcon"
              class="w-12 h-12 ml-4 cursor-pointer select-none"
              @click.stop="selectSong(index)" />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { songs, currentSongIndex, loadSong, playAudio, pauseAudio, isPlaying, shouldAutoPlay } from '../composables/Songs.js';
import { playIcon, pauseIcon } from '../composables/Icons.js';
import { folders } from '../composables/Folder.js';
async function selectSong(index) {
  if (currentSongIndex.value === index) {
    if (isPlaying.value) {
      pauseAudio();
    } else {
      await playAudio();
    }
    return;
  }
  currentSongIndex.value = index;
  shouldAutoPlay.value = true;
  await loadSong(index);
  await playAudio();
}
</script>

<style scoped>
section::-webkit-scrollbar {
  width: 8px;
}

section::-webkit-scrollbar-track {
  background: #1f1f1f;
  border-radius: 4px;
}

section::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 4px;
  border: 2px solid #1f1f1f;
}

section::-webkit-scrollbar-thumb:hover {
  background-color: #888;
}
</style>
