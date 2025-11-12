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
      State: false,
      CurrentSong: { path: '', name: '', artist: '' },
      CurrentPlaylist: { path: '', songs: [] },
    });
  }
  // Finds systems Music folder
  async setupMainFolder() {
    this.MainFolder.value.path = await window.electronAPI.checkMusicFolder();
    this.MainFolder.value.songs = await window.electronAPI.LoadSongs(this.MainFolder.value.path);
  }
  // Finds Subfolders within Music folder for playlists
  async setupSubFolders() {
    const array = await window.electronAPI.getFolders(this.MainFolder.value.path);
    for (let i = 0; i < array.length; i++) {
      const songs = await window.electronAPI.LoadSongs(array[i]);
      this.SubFolders.value.push({ path: array[i], songs: songs });
    }
  }
  // Setup CurrentState method
  async initializeCurrentState() {
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
        this.CurrentState.value.CurrentSong.rawseconds =
          this.CurrentState.value.CurrentPlaylist.find((song) => song.path === this.CurrentState.value.CurrentSong.path)?.rawseconds ||
          'Unknown';

        this.CurrentState.value.CurrentSong.duration =
          this.CurrentState.value.CurrentPlaylist.find((song) => song.path === this.CurrentState.value.CurrentSong.path)?.duration ||
          'Unknown';

        this.CurrentState.value.State = true;
      } catch (error) {
        alert('Could not Start Playback' + error);
      }
    } else {
      this.CurrentState.value.CurrentPlaylist = await window.electronAPI.LoadSongs(path);
      this.CurrentState.value.CurrentPlaylist.path = path;
      this.CurrentState.value.State = true;
    }
  }

  async togglePlayback() {
    this.CurrentState.value.IsPlaying = !this.CurrentState.value.IsPlaying;
  }

  async GetMP3() {
    const filepath = this.CurrentState.value.CurrentSong.path;
    const buffer = await window.electronAPI.getMp3Buffer(filepath);
    return buffer;
  }
}
