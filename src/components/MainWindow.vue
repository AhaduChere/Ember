<template>
  <div class="bg-[#121212] text-white min-h-screen">
    <main class="grid grid-cols-5 lg:grid-cols-6 h-full overflow-clip">
      <section class="col-span-1 border-r-4 border-stone-900 h-svh overflow-y-auto p-2 flex flex-col gap-2">
        <div class="w-full h-20 flex justify-center items-center border-b-4 border-stone-900">
          <img :src="refresh" draggable="false" class="w-10 h-auto cursor-pointer select-none" />
        </div>
        <div
          v-for="folderItem in folders"
          :key="folderItem"
          class="bg-[#1f1f1f] w-full hover:bg-[#2a2a2a] p-4 rounded-lg cursor-pointer select-none flex flex-col justify-center items-center transition-colors break-words"
          :class="folderItem === folder ? 'text-[#ea580c] font-bold' : 'text-white font-medium'"
          @click="selectFolder(folderItem)">
          {{ folderItem.split('/').pop() }}
        </div>
      </section>
      <section class="col-span-4 lg:col-span-5 h-svh overflow-y-auto px-5 pt-6 flex flex-col gap-4">
        <div
          v-for="(song, index) in songs"
          :key="song.name"
          class="bg-[#1f1f1f] hover:bg-[#2a2a2a] p-4 rounded-lg flex items-center justify-start transition">
          <img
            draggable="false"
            :src="nowPlaying?.path === song.path && isPlaying ? pauseIcon : playIcon"
            class="w-12 h-12 mr-4 cursor-pointer select-none"
            @click.stop="selectSong(index)" />
          <span :class="['text-lg truncate font-bold select-none', nowPlaying?.path === song.path ? 'text-[#ea580c]' : 'text-white']">
            {{ song.name.replace(/\.mp3$/, '') }}
          </span>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { playIcon, pauseIcon, refresh } from '../composables/Icons.js';
import {
  songs,
  currentSongIndex,
  loadSong,
  playAudio,
  pauseAudio,
  isPlaying,
  shouldAutoPlay,
  folder,
  folders,
  setSongs,
  nowPlaying,
  activePlaylist,
} from '../composables/Songs.js';

const lastFolder = ref(folder.value);
const activeSongs = ref([]);

onMounted(async () => {
  const allFolders = await window.electronAPI.getFolders(folder.value);
  if (allFolders.length > 0) folders.value = [folder.value, ...allFolders.filter((f) => f !== folder.value)];

  const loadedSongs = await window.electronAPI.LoadSongs(folder.value);
  setSongs(loadedSongs);
  activeSongs.value = loadedSongs;
  const idx = nowPlaying.value ? loadedSongs.findIndex((s) => s.path === nowPlaying.value.path) : -1;
  currentSongIndex.value = idx >= 0 ? idx : -1;
});

async function selectSong(index) {
  const song = songs.value[index];
  if (song.path === nowPlaying.value?.path) {
    if (isPlaying.value) pauseAudio();
    else await playAudio();
    return;
  }

  currentSongIndex.value = index;
  shouldAutoPlay.value = true;
  activePlaylist.value = songs.value.slice();
  await loadSong(index);
  await playAudio();
  nowPlaying.value = song;
  lastFolder.value = folder.value;
}

async function selectFolder(path) {
  folder.value = path;
  const loadedSongs = await window.electronAPI.LoadSongs(path);
  setSongs(loadedSongs);
  const idx = nowPlaying.value ? loadedSongs.findIndex((s) => s.path === nowPlaying.value.path) : -1;
  currentSongIndex.value = idx >= 0 ? idx : -1;
  lastFolder.value = folder.value;
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
