<template>
  <main class="grid grid-cols-3">
    <section class="border-r-2 border-black h-[100vh] col-1">
      <div class="text-white">
        playists/folders will go here<br />
        {{ mainplaylist }}
      </div>
    </section>
    <section class="border-l-2 border-black h-[100vh] col-2">
      <div class="text-white">songs in selected playlist will go here</div>
    </section>
  </main>
</template>

<script setup>
import { folder } from '../composables/Folder.js';
import { onMounted, ref } from 'vue';

const mainplaylist = ref(null);
const Playlists = ref([]);

onMounted(() => {
  mainplaylist.value = folder.value;
});
</script>
