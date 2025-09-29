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
import { useRouter } from 'vue-router';
const router = useRouter();

async function selectFolder() {
  const folder = await window.electronAPI.openFolderDialog();
  if (folder) {
    const songs = await window.electronAPI.getSongs(); // load .mp3 files
    if (songs.length > 0) {
      router.push('/'); // navigate to main route
    }
  }
}
</script>
