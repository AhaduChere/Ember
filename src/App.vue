<template>
  <div v-if="loading" class="bg-stone-900 w-screen h-screen" />
  <div v-else>
    <p class="text-white">Check console for MusicState test output.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { folder } from './composables/Songs.js';
import { MusicState } from './composables/MusicState.js';

const loading = ref(true);
const musicState = new MusicState();

async function testMusicState() {
  // 1️⃣ Setup main folder
  await musicState.SetupMainFolder();
  console.log('✅ Main folder:', musicState.MainFolder.value);

  // 2️⃣ Setup subfolders
  await musicState.SetupSubFolders();
  console.log('✅ Subfolders:', musicState.SubFolders.value);

  // 3️⃣ Pick a test song (first song from main folder)
  const firstSong = musicState.MainFolder.value.songs?.[0];
  if (firstSong) {
    console.log('🎵 Testing GetPlayback for:', firstSong.path);
    await musicState.GetPlayback(firstSong.path);

    // 4️⃣ Log the resulting CurrentState
    console.log('🎧 CurrentState:', musicState.CurrentState.value);

    // 5️⃣ Optionally test another branch (folder playback)
    // e.g., take a subfolder path
    const subfolder = musicState.SubFolders.value?.[0];
    if (subfolder?.songs?.[0]) {
      console.log('📂 Testing GetPlayback for folder song:', subfolder.songs[0].path);
      await musicState.GetPlayback(subfolder.songs[0].path);
      console.log('🎧 CurrentState (subfolder):', musicState.CurrentState.value);
    }
  } else {
    console.warn('⚠️ No songs found in main folder.');
  }

  loading.value = false;
}

onMounted(async () => {
  if (folder.value == null) {
    const result = await window.electronAPI.checkMusicFolder();
    folder.value = result;
  }
  await testMusicState();
});
</script>
