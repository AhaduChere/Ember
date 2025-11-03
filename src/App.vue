<template>
  <div class="bg-stone-900 w-screen h-screen">
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue';
import { MusicState } from './composables/MusicState.js';

const loading = ref(true);
const musicState = new MusicState();

provide('musicState', musicState);

onMounted(async () => {
  await musicState.SetupMainFolder();
  await musicState.SetupSubFolders();
  loading.value = false;
});
</script>
