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
async function selectFolder() {
  const folder = await window.electronAPI.openFolderDialog();
  if (folder) {
    console.log(folder);
  }
}
</script>
