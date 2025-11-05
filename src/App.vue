<template>
  <div class="bg-stone-900 w-screen h-screen">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted, provide } from 'vue';
import { MusicState } from './composables/MusicState.js';

const musicState = new MusicState();
provide('musicState', musicState);

onMounted(async () => {
  await musicState.setupMainFolder();
  await musicState.setupSubFolders();
  await musicState.initializeCurrentState();
});
</script>
