import { ref } from 'vue';

export class MusicState {
  constructor() {
    this.MainFolder = ref({});
    this.SubFolders = ref([]);
    this.IsPlaying = ref(false);
    this.CurrentState = ref({
      CurrentSong: { path: '', name: '', artist: '' },
      CurrentPlaylist: [],
    });
  }

  async SetupMainFolder() {
    this.MainFolder.value.path = await window.electronAPI.checkMusicFolder();
    this.MainFolder.value.songs = await window.electronAPI.LoadSongs(this.MainFolder.value.path);

  }

  async SetupSubFolders() {
    const array = await window.electronAPI.getFolders(this.MainFolder.value.path);
    for (let i = 0; i < array.length; i++) {
      const songs = await window.electronAPI.LoadSongs(array[i]);
      this.SubFolders.value.push({ path: array[i], songs: songs });
    }
  }

  async GetPlayback(path) {
    if (path.endsWith('.mp3')) {
      try {
        this.CurrentState.value.CurrentPlaylist = await window.electronAPI.LoadSongs(path);
        this.CurrentState.value.CurrentSong.path = path;
        this.CurrentState.value.CurrentSong.name = this.CurrentState.value.CurrentPlaylist.find(song => song.path === this.CurrentState.value.CurrentSong.path)?.name || 'Unknown';
        this.CurrentState.value.CurrentSong.artist = this.CurrentState.value.CurrentPlaylist.find(song => song.path === this.CurrentState.value.CurrentSong.path)?.artist || 'Unknown';
      } catch (error) {
        alert('Could not Start Playback' + error);
      }
    } else {
      this.CurrentState.value.CurrentPlaylist = await window.electronAPI.LoadSongs(path)
    }
  }
}
