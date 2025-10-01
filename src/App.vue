<template>
  <div v-if="loading" class="bg-stone-900 w-screen h-screen" />
  <div v-else-if="folder">
    <router-view />
  </div>
  <div v-else>
    <FolderSelect />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { folder } from './composables/Folder';

const loading = ref(true);

onMounted(async () => {
  if (folder.value == null) {
    const result = await window.electronAPI.checkMusicFolder();
    folder.value = result;
  }
  loading.value = false;
});
</script>
