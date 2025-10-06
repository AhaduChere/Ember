<template>
  <div class="bg-[#121212] text-white min-h-screen">
    <main class="grid grid-cols-3 gap-6 overflow-clip">
      <section class="col-span-1 border-r-4 border-black pr-4 h-[80vh] overflow-x-clip">
        <div>playlists/folders will go here</div>
      </section>
      <section class="col-span-2 h-[80vh] overflow-y-auto overflow-x-clip">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 pr-4">
          <div
            v-for="(song, index) in songs"
            :key="song.name"
            class="bg-[#1f1f1f] hover:bg-[#2a2a2a] p-4 rounded-lg flex items-center justify-between transition">
            <span class="text-lg font-semibold truncate">
              {{ song.name.replace(/\.mp3$/, '') }}
            </span>
            <img
              draggable="false"
              :src="currentSongIndex === index && isPlaying ? pauseIcon : playIcon"
              class="w-12 h-12 ml-4 cursor-pointer"
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
