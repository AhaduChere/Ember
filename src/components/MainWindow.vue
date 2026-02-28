<template>
  <div class="bg-[#121212] text-white min-h-screen">
    <main class="h-full overflow-clip flex">
      <section class="flex-1 border-r border-stone-800 overflow-y-auto p-4 flex flex-col gap-3" :style="{ height: 'calc(100vh - 6rem)' }">
        <button
          class="bg-[#1f1f1f] cursor-pointer hover:bg-[#2a2a2a] gap-3 flex p-4 rounded-xl font-semibold transition-colors shadow-md select-none justify-center"
          @click="refreshApp">
          <img draggable="false" :src="Icons.refresh" class="w-8 h-auto select-none" />
          <p class="pt-0.5">Refresh</p>
        </button>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div
            v-for="folder in allFolders"
            :key="folder.path"
            class="flex flex-col items-center cursor-pointer"
            @click.stop="selectFolder(folder.path)">
            <div
              class="w-full max-w-40 h-40 bg-[#1f1f1f] rounded-xl overflow-hidden shadow-md flex items-center justify-center"
              :class="[
                musicState.CurrentState.value.CurrentPlaylist?.path === folder.path
                  ? 'ring-2 ring-[#ea580c] ring-offset-2 ring-offset-[#121212]'
                  : '',
              ]">
              <img v-if="folder.cover" :src="folder.cover" class="w-full h-full object-cover select-none" alt="cover" />
              <img v-else :src="Icons.logo" class="w-2/3 mb-1" />
            </div>
            <div class="mt-3 text-center">
              <span
                class="block text-base font-bold truncate select-none"
                :class="musicState.CurrentState.value.CurrentPlaylist?.path === folder.path ? 'text-[#ea580c]' : 'text-white'">
                {{ folder.path.split('/').pop() }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        class="flex-3 overflow-y-scroll px-6 py-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-gray-700"
        :style="{ height: 'calc(100vh - 7rem)' }">
        <div class="bg-[#1f1f1f] w-full rounded-xl p-6 flex items-center gap-6">
          <div class="w-36 h-36 bg-[#181818] rounded-md flex items-center justify-center shadow-lg overflow-hidden">
            <img
              v-if="musicState.CurrentState.value.CurrentPlaylist.cover"
              :src="musicState.CurrentState.value.CurrentPlaylist.cover"
              class="w-full h-full object-cover select-none" />
            <img v-else :src="Icons.logo" class="w-2/3 mb-1" />
          </div>

          <div class="flex flex-col justify-center">
            <span class="uppercase text-sm font-semibold tracking-widest text-gray-400 select-none"> Playlist </span>

            <h1 class="text-4xl sm:text-5xl font-extrabold mt-1 select-none">
              {{ musicState.CurrentState.value.CurrentPlaylist.path.split('/').pop() }}
            </h1>

            <div class="flex gap-2 text-gray-300 text-sm mt-2 select-none">
              <span>Songs: {{ (musicState.CurrentState.value.CurrentPlaylist || []).length }} </span>
            </div>
          </div>
        </div>

        <div
          v-for="song in musicState.CurrentState.value.CurrentPlaylist || []"
          :key="song.path"
          :class="[
            'bg-[#1f1f1f] hover:bg-[#2a2a2a] p-4 rounded-xl flex items-center gap-4 cursor-pointer',
            musicState.CurrentState.value.CurrentSong?.path === song.path
              ? 'ring-2 ring-[#ea580c] ring-offset-2 ring-offset-[#121212]'
              : '',
          ]"
          @dblclick.stop="selectSong(song.path)">
          <img
            draggable="false"
            :src="
              musicState.CurrentState.value.CurrentSong?.path === song.path && musicState.IsPlaying.value ? Icons.pauseIcon : Icons.playIcon
            "
            class="w-12 h-12 cursor-pointer select-none"
            @click.stop="selectSong(song.path)" />
          <div class="flex flex-col overflow-hidden">
            <span
              :class="[
                'truncate font-semibold text-lg select-none',
                musicState.CurrentState.value.CurrentSong?.path === song.path ? 'text-[#ea580c]' : 'text-white',
              ]">
              {{ song.name || 'Unknown' }}
            </span>
            <span class="truncate text-sm text-gray-400 select-none">
              {{ song.artist || 'Unknown Artist' }}
            </span>
          </div>
          <span class="text-sm text-gray-400 select-none ml-auto">
            {{ song.duration || 'Unknown Artist' }}
          </span>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue';
import Icons from '../composables/Icons.js';

const musicState = inject('musicState');
if (!musicState) throw new Error('MusicState not provided!');

const allFolders = computed(() => {
  const list = [...(musicState.SubFolders.value || [])];
  list.unshift(musicState.MainFolder.value);
  return list;
});

async function selectSong(path) {
  if (musicState.CurrentState.value.CurrentSong.path !== path) {
    await musicState.updateCurrentState(path);
    await musicState.getMP3();
    musicState.IsPlaying.value = true;
    musicState.audioRef.value.play();
  } else {
    musicState.togglePlayback();
  }
}

async function selectFolder(path) {
  if (path == musicState.CurrentState.value.CurrentPlaylist.path) return;
  else {
    await musicState.updateCurrentState(path);
  }
}

const refreshApp = async () => {
  await window.electronAPI.refreshApp();
};
</script>

<style scoped>
section::-webkit-scrollbar {
  /* width: 8px; */
  display: none;
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
