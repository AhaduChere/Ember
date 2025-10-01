import { ref } from 'vue';

export const songs = ref([]);
export const currentSongIndex = ref(0);

export function setSongs(newSongs) {
  songs.value = newSongs;
}
