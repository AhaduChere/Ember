<template>
  <div class="bg-[#121212] text-white min-h-screen">
    <main class="grid grid-cols-3 gap-6">
      <section class="col-span-1 border-r-2 border-black pr-4 h-[80vh]">
        <div>playlists/folders will go here</div>
      </section>
      <section class="col-span-2 overflow-y-auto overflow-x-clip">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6 pr-4">
          <div
            v-for="song in songs"
            :key="song.name"
            class="bg-[#1f1f1f] hover:bg-[#2a2a2a] p-4 rounded-lg flex items-center justify-between transition">
            <span class="text-lg font-semibold truncate">
              {{ song.name.replace(/\.mp3$/, '') }}
            </span>
            <img draggable="false" :src="playIcon" alt="Play" class="w-12 h-12 ml-4" />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { songs } from '../composables/Songs.js';
import { playIcon } from '../composables/Icons.js';
</script>
