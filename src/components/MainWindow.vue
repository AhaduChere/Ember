<template>
  <div class="bg-[#121212] text-white min-h-screen">
    <main class="grid grid-cols-5 lg:grid-cols-6 overflow-clip">
      <section class="col-span-1 border-r-4 border-stone-900 p-4">
        <div class="grid grid-cols-1 gap-2">
          <div
            v-for="folderItem in folders"
            :key="folderItem"
            class="bg-[#1f1f1f] w-full hover:bg-[#2a2a2a] p-6 rounded-lg truncate cursor-pointer select-none flex justify-center items-center transition-colors"
            :class="folderItem === folder ? 'text-[#ea580c] font-bold' : 'text-white font-medium'"
            @click="selectFolder(folderItem)">
            {{ folderItem.split('/').pop() }}
          </div>
        </div>
      </section>
      <section class="col-span-4 lg:col-span-5 h-svh overflow-y-auto overflow-x-hidden">
        <div class="grid grid-cols-1 gap-4 mt-6 px-5">
          <div
            v-for="(song, index) in songs"
            :key="song.name"
            class="bg-[#1f1f1f] hover:bg-[#2a2a2a] p-4 rounded-lg flex items-center justify-start transition">
            <img
              draggable="false"
              :src="nowPlaying?.path === song.path && isPlaying ? pauseIcon : playIcon"
              class="w-12 h-12 mr-4 cursor-pointer select-none"
              @click.stop="selectSong(index)" />
            <span
              :class="[
                'text-lg truncate select-none justify-center font-bold',
                nowPlaying?.path === song.path ? 'text-[#ea580c]' : 'text-white',
              ]">
              {{ song.name.replace(/\.mp3$/, ' ') }}
            </span>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { playIcon, pauseIcon } from '../composables/Icons.js';
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
