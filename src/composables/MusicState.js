import { ref } from 'vue';

export class MusicState {
  // Main Variables
  constructor() {
    this.MainFolder = ref({
      path: '',
    });
    this.SubFolders = ref([]);
    this.IsPlaying = ref(false);
    this.CurrentState = ref({
      CurrentSong: { path: '', name: '', artist: '' },
      CurrentPlaylist: { path: '', songs: [] },
    });
  }

  // Finds systems Music folder
  async SetupMainFolder() {
    this.MainFolder.value.path = await window.electronAPI.checkMusicFolder();
    this.MainFolder.value.songs = await window.electronAPI.LoadSongs(this.MainFolder.value.path);
  }

  // Finds Subfolders within Music folder for playlists
  async SetupSubFolders() {
    const array = await window.electronAPI.getFolders(this.MainFolder.value.path);
    for (let i = 0; i < array.length; i++) {
      const songs = await window.electronAPI.LoadSongs(array[i]);
      this.SubFolders.value.push({ path: array[i], songs: songs });
    }
  }
  // Update CurrentState method
  async InitializeCurrentState() {
    this.CurrentState.value.CurrentPlaylist = await window.electronAPI.LoadSongs(this.MainFolder.value.path);
    this.CurrentState.value.CurrentPlaylist.path = this.MainFolder.value.path;
  }

  async updateCurrentState(path) {
    if (path.endsWith('.mp3')) {
      try {
        this.CurrentState.value.CurrentPlaylist.songs = await window.electronAPI.LoadSongs(path);
        this.CurrentState.value.CurrentSong.path = path;

        this.CurrentState.value.CurrentSong.name =
          this.CurrentState.value.CurrentPlaylist.find((song) => song.path === this.CurrentState.value.CurrentSong.path)?.name || 'Unknown';

        this.CurrentState.value.CurrentSong.artist =
          this.CurrentState.value.CurrentPlaylist.find((song) => song.path === this.CurrentState.value.CurrentSong.path)?.artist ||
          'Unknown';
      } catch (error) {
        alert('Could not Start Playback' + error);
      }
    } else {
      this.CurrentState.value.CurrentPlaylist = await window.electronAPI.LoadSongs(path);
      this.CurrentState.value.CurrentPlaylist.path = path;
    }
  }
}
