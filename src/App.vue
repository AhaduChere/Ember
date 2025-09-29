<template>
  <div v-if="folderOk">
    <router-view />
  </div>
  <div v-else>
    <FolderSelect />
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted } from 'vue';
const folderOk = ref(true);

onBeforeMount(async () => {
  folderOk.value = await window.electronAPI.checkFolder();
});

onMounted(() => {
  if (!folderOk.value) {
    console.log('doing');
  } else {
    console.log('Not doing');
  }
});
</script>
