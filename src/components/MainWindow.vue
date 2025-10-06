<template>
  <div class="bg-[#121212] text-white min-h-screen">
    <main class="grid grid-cols-3 overflow-clip">
      <section class="col-span-1 border-r-4 border-stone-700 px-4 h-[100vh] overflow-x-clip">
        <div>all playlists/folders will go here</div>
      </section>
      <section class="col-span-2 h-[80vh] overflow-y-auto overflow-x-hidden">
        <div class="h-40 border-b-4 border-stone-700 pl-4">
          <div>Name of Current playlist will go here</div>
        </div>
        <div class="grid grid-cols-1 gap-4 mt-6 px-5">
          <div
            v-for="(song, index) in songs"
            :key="song.name"
            class="bg-[#1f1f1f] hover:bg-[#2a2a2a] p-4 rounded-lg flex items-center justify-between transition">
            <span class="text-lg font-semibold truncate select-none justify-center">
              {{ song.name.replace(/\.mp3$/, '') }}
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
