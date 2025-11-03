<template>
  <div class="bg-[#121212] text-white min-h-screen">
    <main class="grid grid-cols-4 h-full overflow-clip">
      <section
        class="col-span-1 border-r border-stone-800 overflow-y-auto p-4 flex flex-col gap-3"
        :style="{ height: 'calc(100vh - 6rem)' }">
        <button
          class="bg-[#1f1f1f] cursor-pointer hover:bg-[#2a2a2a] gap-3 flex p-4 rounded-xl font-semibold transition-colors shadow-md select-none justify-center"
          @click="refreshApp">
          <img draggable="false" :src="refresh" class="w-8 h-auto select-none" />
          <p class="pt-0.5">Refresh</p>
        </button>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-4">
          <div class="group bg-[#1f1f1f] rounded-xl cursor-pointer overflow-hidden transition-all shadow-md">
            <div class="h-24 bg-[#1f1f1f] flex items-center justify-center">
              <span class="text-9xl text-[#ea580c] font-bold select-none"> ♪ </span>
            </div>
            <div class="p-4 text-center">
              <span class="block text-base font-semibold truncate text-gray-200 select-none">
                {{ mainFolder.value }}
              </span>
            </div>
          </div>

          <div
            v-for="folder in subFolders"
            :key="folder.path"
            class="group bg-[#1f1f1f] rounded-xl cursor-pointer overflow-hidden transition-all shadow-md">
            <div class="h-24 bg-[#1f1f1f] flex items-center justify-center">
              <span class="text-9xl text-[#ea580c] font-bold select-none"> ♪ </span>
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
            <div class="flex flex-col overflow-hidden">
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
            </div>
            <span class="text-sm text-gray-400 select-none ml-auto">Put song length here</span>
          </template>

          <template v-else>
            <span :class="['truncate font-semibold text-lg select-none', nowPlaying?.path === song.path ? 'text-[#ea580c]' : 'text-white']">
              {{ song.name.replace(/\.mp3$/, '').trim() }}
            </span>
            <span class="truncate text-sm text-gray-400 select-none"> Unnamed Artist </span>
          </template>
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
import { onMounted, inject, ref } from 'vue';
import VueSlider from 'vue-3-slider-component';
import { playIcon, pauseIcon, refresh, audioOff, audioOn } from '../composables/Icons.js';

const mainFolder = ref('');
const subFolders = ref([]);

onMounted(() => {
  const musicState = inject('musicState');
  if (!musicState) {
    throw new Error('MusicState not provided!');
  } else {
    mainFolder.value = musicState.MainFolder.path;
    subFolders.value = musicState.SubFolders;
    console.log(musicState.MainFolder.path);
    console.log(mainFolder.value);
  }
});

async function selectSong(index) {
  const song = songs.value[index];
}

async function selectFolder(path) {
  folder.value = path;
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
