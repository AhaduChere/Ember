<template>
  <div class="bg-[#121212] text-white min-h-screen">
    <main class="grid grid-cols-4 h-full overflow-clip">
      <section class="col-span-1 border-r border-stone-800 h-screen overflow-y-auto p-4 flex flex-col gap-3">
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div
            v-for="folderItem in folders"
            :key="folderItem"
            class="min-w-[150px] bg-[#1f1f1f]/80 hover:bg-[#1f1f1f] rounded-xl cursor-pointer select-none font-medium transition-colors text-center flex items-center justify-center p-6"
            :class="folderItem === folder ? 'text-[#ea580c] ring-2 ring-[#ea580c] ring-offset-2 ring-offset-[#121212]' : 'text-gray-300'"
            @click="selectFolder(folderItem)">
            {{ folderItem.split('/').pop() }}
          </div>
        </div>
      </section>

      <section class="col-span-2 h-screen overflow-y-auto px-6 pt-6 flex flex-col gap-4">
        <div
          v-for="(song, index) in songs"
          :key="song.name"
          class="bg-[#1f1f1f] hover:bg-[#2a2a2a] p-4 rounded-xl flex items-center gap-4 transition cursor-pointer">
          <img
            draggable="false"
            :src="nowPlaying?.path === song.path && isPlaying ? pauseIcon : playIcon"
            class="w-12 h-12 cursor-pointer select-none"
            @click.stop="selectSong(index)" />

          <div class="flex flex-col overflow-hidden">
            <template v-if="song.name.includes('-')">
              <span
                :class="['truncate font-semibold text-lg select-none', nowPlaying?.path === song.path ? 'text-[#ea580c]' : 'text-white']">
                {{
                  song.name
                    .replace(/\.mp3$/, '')
                    .split('-')[0]
                    .trim()
                }}
              </span>
              <span class="truncate text-sm text-gray-400 select-none">
                {{
                  song.name
                    .replace(/\.mp3$/, '')
                    .split('-')
                    .slice(1)
                    .join('-')
                    .trim()
                }}
              </span>
            </template>

            <template v-else>
              <span
                :class="['truncate font-semibold text-lg select-none', nowPlaying?.path === song.path ? 'text-[#ea580c]' : 'text-white']">
                {{ song.name.replace(/\.mp3$/, '').trim() }}
              </span>
              <span class="truncate text-sm text-gray-400 select-none"> Unnamed Artist </span>
            </template>
          </div>
        </div>
      </section>

      <section class="col-span-1 border-l border-stone-800 h-screen overflow-y-auto p-4 flex flex-col gap-3">
        <div
          class="bg-[#1f1f1f] hover:bg-[#2a2a2a] p-3 rounded-xl cursor-pointer select-none flex items-center justify-center text-center font-semibold transition-colors"
          @click="refreshApp">
          Refresh
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

const refreshApp = async () => {
  await window.electronAPI.refreshApp();
};
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
