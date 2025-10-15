<template>
  <div class="bg-[#121212] text-white min-h-screen">
    <main class="grid grid-cols-4 h-full overflow-clip">
      <section
        class="col-span-1 border-r border-stone-800 overflow-y-auto p-4 flex flex-col gap-3"
        :style="{ height: 'calc(100vh - 6rem)' }">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            v-for="folderItem in folders"
            :key="folderItem"
            class="group bg-[#1f1f1f] rounded-xl cursor-pointer overflow-hidden transition-all shadow-md"
            :class="folderItem === folder ? 'ring-2 ring-[#ea580c] ring-offset-2 ring-offset-[#121212]' : ''"
            @click="selectFolder(folderItem)">
            <div class="h-24 bg-[#1f1f1f] flex items-center justify-center">
              <span class="text-9xl text-[#ea580c] font-bold select-none"> ♪ </span>
            </div>
            <div class="p-4 text-center">
              <span class="block text-base font-semibold truncate text-gray-200">
                {{ folderItem.split('/').pop() }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        class="col-span-2 overflow-y-scroll px-6 pt-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-gray-700"
        :style="{ height: 'calc(100vh - 7rem)' }">
        <div
          v-for="(song, index) in songs"
          :key="song.name"
          :class="[
            'bg-[#1f1f1f] hover:bg-[#2a2a2a] p-4 rounded-xl flex items-center gap-4  cursor-pointer',
            nowPlaying?.path === song.path ? 'ring-2 ring-[#ea580c] ring-offset-2 ring-offset-[#121212]' : '',
          ]">
          <img
            draggable="false"
            :src="nowPlaying?.path === song.path && isPlaying ? pauseIcon : playIcon"
            class="w-12 h-12 cursor-pointer select-none"
            @click.stop="selectSong(index)" />

          <template v-if="song.name.includes('-')">
            <div class="flex justify-between items-center w-full">
              <span
                :class="['truncate font-semibold text-lg select-none', nowPlaying?.path === song.path ? 'text-[#ea580c]' : 'text-white']">
                {{
                  song.name
                    .replace(/\.mp3$/, '')
                    .split('-')[0]
                    .trim()
                }}
              </span>
              <span class="truncate text-sm text-gray-400 select-none ml-4 text-right">
                {{
                  song.name
                    .replace(/\.mp3$/, '')
                    .split('-')
                    .slice(1)
                    .join('-')
                    .trim()
                }}
              </span>
            </div>
          </template>

          <template v-else>
            <span :class="['truncate font-semibold text-lg select-none', nowPlaying?.path === song.path ? 'text-[#ea580c]' : 'text-white']">
              {{ song.name.replace(/\.mp3$/, '').trim() }}
            </span>
            <span class="truncate text-sm text-gray-400 select-none"> Unnamed Artist </span>
          </template>
        </div>
      </section>

      <section
        class="col-span-1 border-l border-stone-800 overflow-y-auto p-6 flex flex-col gap-6"
        :style="{ height: 'calc(100vh - 8rem)' }">
        <button
          class="bg-[#1f1f1f] cursor-pointer hover:bg-[#2a2a2a] flex items-center justify-center gap-3 p-4 rounded-xl font-semibold transition-colors shadow-md select-none"
          @click="refreshApp">
          <img draggable="false" :src="refresh" class="w-8 h-auto select-none" />
          Refresh
        </button>
        <div class="flex items-center gap-4 mt-4">
          <img draggable="false" :src="volume === 0 ? audioOff : audioOn" class="w-8 h-auto select-none" />
          <VueSlider
            v-model="volume"
            :min="0"
            :max="100"
            :height="6"
            :dot-size="14"
            :process-style="{ backgroundColor: '#ea580c' }"
            :rail-style="{ backgroundColor: '#4B5563' }"
            :tooltip="'none'"
            class="flex-1" />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import VueSlider from 'vue-3-slider-component';
import { playIcon, pauseIcon, refresh, audioOff, audioOn } from '../composables/Icons.js';
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
  volume,
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
  /*   display: none; */
}

section::-webkit-scrollbar-track {
  background: transparent;
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
