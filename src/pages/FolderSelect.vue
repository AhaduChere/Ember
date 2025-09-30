<template>
  <div class="flex items-center justify-center h-screen bg-neutral-950">
    <div
      class="text-white select-none cursor-pointer border-white rounded-lg bg-orange-600 hover:bg-orange-700 p-4 duration-100"
      @click="selectFolder">
      Select Music Folder
    </div>
  </div>
</template>

<script setup>
import { folder } from '../composables/MusicFolder';
import { useRouter } from 'vue-router';
const router = useRouter();

async function selectFolder() {
  const selected = await window.electronAPI.openFolderDialog();
  if (selected) {
    folder.value = selected;
    router.push('/');
  }
}
</script>
