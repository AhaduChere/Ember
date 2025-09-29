<template>
  <div v-if="folderOk">
    <router-view />
  </div>
  <div v-else>
    <FolderSelect />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const folderOk = ref(true);

onMounted(async () => {
  folderOk.value = await window.electronAPI.checkFolder();
});
</script>
