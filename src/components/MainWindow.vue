<template>
  <div class="bg-[#121212] text-white min-h-screen">
    <main class="grid grid-cols-4 h-full overflow-clip">
      <section
        class="col-span-1 border-r border-stone-800 overflow-y-auto p-4 flex flex-col gap-3"
        :style="{ height: 'calc(100vh - 6rem)' }">
        <button
          class="bg-[#1f1f1f] cursor-pointer hover:bg-[#2a2a2a] gap-3 flex p-4 rounded-xl font-semibold transition-colors shadow-md select-none justify-center"
          @click="refreshApp">
          <img draggable="false" :src="Icons.refresh" class="w-8 h-auto select-none" />
          <p class="pt-0.5">Refresh</p>
        </button>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-4">
          <div
            v-for="folder in allFolders"
            :key="folder.path"
            class="group bg-[#1f1f1f] rounded-xl cursor-pointer overflow-hidden transition-all shadow-md"
            :class="[
              musicState.CurrentState.value.CurrentPlaylist?.path === folder.path
                ? 'ring-2 ring-[#ea580c] ring-offset-2 ring-offset-[#121212]'
                : '',
            ]"
            @click.stop="selectFolder(folder.path)">
            <div class="h-24 bg-[#1f1f1f] flex items-center justify-center">
              <span class="text-9xl text-[#ea580c] font-bold select-none">♪</span>
            </div>
            <div class="p-4 text-center">
              <span class="block text-base font-semibold truncate text-gray-200 select-none">
                {{ folder.path.split('/').pop() }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        class="col-span-2 overflow-y-scroll px-6 pt-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-gray-700"
        :style="{ height: 'calc(100vh - 7rem)' }">
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
              musicState.CurrentState.value.CurrentSong?.path === song.path && musicState.CurrentState.value.IsPlaying
                ? Icons.pauseIcon
                : Icons.playIcon
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

      <!-- <section -->
      <!--   class="col-span-1 border-l border-stone-800 overflow-y-auto p-6 flex flex-col gap-6" -->
      <!--   :style="{ height: 'calc(100vh - 8rem)' }"> -->
      <!--   <div class="flex items-center gap-4 mt-4"> -->
      <!--     <img draggable="false" :src="volume === 0 ? audioOff : audioOn" class="w-8 h-auto select-none" /> -->
      <!--     <VueSlider -->
      <!--       v-model="volume" -->
      <!--       :min="0" -->
      <!--       :max="100" -->
      <!--       :height="6" -->
      <!--       :dot-size="10" -->
      <!--       :process-style="{ backgroundColor: '#ea580c' }" -->
      <!--       :rail-style="{ backgroundColor: '#4B5563' }" -->
      <!--       :tooltip="'none'" -->
      <!--       class="flex-1" /> -->
      <!--   </div> -->
      <!-- </section> -->
    </main>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue';
import Icons from '../composables/Icons.js';
import VueSlider from 'vue-3-slider-component';

const musicState = inject('musicState');
if (!musicState) throw new Error('MusicState not provided!');

const allFolders = computed(() => {
  const list = [...(musicState.SubFolders.value || [])];
  list.unshift(musicState.MainFolder.value);
  return list;
});

async function selectSong(path) {
  if (!musicState.CurrentState.value.CurrentSong.path) {
    await musicState.updateCurrentState(path);
    musicState.CurrentState.value.IsPlaying = true;
  } else if (musicState.CurrentState.value.CurrentSong.path != path) {
    musicState.CurrentState.value.IsPlaying = true;
    await musicState.updateCurrentState(path);
  } else {
    musicState.togglePlayback();
  }
}

async function selectFolder(path) {
  await musicState.updateCurrentState(path);
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
