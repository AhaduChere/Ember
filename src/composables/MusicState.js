import { ref } from 'vue';

export class MusicState {
  // Main Variables
  constructor() {
    this.MainFolder = ref({
      path: '',
    });
    this.SubFolders = ref([]);
    this.IsPlaying = ref(false);
    this.loopMode = ref(0);
    this.shuffleMode = ref(false);
    this.CurrentState = ref({
      State: false,
      CurrentSong: { path: '', name: '', artist: '' },
      CurrentPlaylist: { path: '', songs: [] },
    });
    this.audioSrc = ref('');
    this.sliderValue = ref();
    this.audioRef = ref(null);
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

  async initializeCurrentState() {
    this.CurrentState.value.CurrentPlaylist = await window.electronAPI.LoadSongs(this.MainFolder.value.path);
    this.CurrentState.value.CurrentPlaylist.path = this.MainFolder.value.path;
  }

  async updateCurrentState(path) {
    const songs = await window.electronAPI.LoadSongs(path);
    const isFile = path.endsWith('.mp3');

    if (isFile) {
      this.CurrentState.value.CurrentPlaylist.songs = songs;
      const song = songs.find((s) => s.path === path) || {};
      Object.assign(this.CurrentState.value.CurrentSong, {
        path,
        name: song.name,
        artist: song.artist,
        rawseconds: song.rawseconds,
        duration: song.duration,
      });
      this.CurrentState.value.State = true;
    } else {
      this.CurrentState.value.CurrentPlaylist = songs;
      this.CurrentState.value.CurrentPlaylist.path = path;
    }
  }

  async toggleShuffle() {
    this.shuffleMode.value = !this.shuffleMode.value;
  }

  // 0 = Off
  // 1 = normal loop
  // 2 = single loop
  async toggleLoop() {
    if (this.loopMode.value == 0) {
      this.loopMode.value = 1;
    } else if (this.loopMode.value == 1) {
      this.loopMode.value = 2;
    } else {
      this.loopMode.value = 0;
    }
  }

  async togglePlayback() {
    if (!this.audioRef?.value) return;
    if (this.IsPlaying.value == true) {
      this.audioRef.value.pause();
    } else if (this.IsPlaying.value == false) {
      this.audioRef.value.play();
    }
    this.IsPlaying.value = !this.IsPlaying.value;
  }

  // Method to get MP3 file loaded on frontend
  async getMP3() {
    const filepath = this.CurrentState.value.CurrentSong.path;
    const buffer = await window.electronAPI.getMp3Buffer(filepath);
    const blob = new Blob([buffer], { type: 'audio/mpeg' });
    // clears blob to prevent memory leak
    if (this.audioSrc.value) {
      URL.revokeObjectURL(this.audioSrc.value);
    }
    this.audioSrc.value = URL.createObjectURL(blob);
  }

  async getNextSong() {
    if (this.shuffleMode.value == true) {
      const songs = this.CurrentState.value.CurrentPlaylist.songs;
      // if playlist has only one song
      if (songs.length <= 1) return songs[0]?.path;

      let randomIndex;
      // random index that isnt current song
      do {
        randomIndex = Math.floor(Math.random() * songs.length);
      } while (songs[randomIndex].path === this.CurrentState.value.CurrentSong.path);

      return songs[randomIndex]?.path;
    } else {
      const songs = this.CurrentState.value.CurrentPlaylist.songs;
      const i = songs.findIndex((s) => s.path === this.CurrentState.value.CurrentSong.path);
      const nextIndex = (i + 1) % songs.length;
      return songs[nextIndex]?.path;
    }
  }

  async getPreviousSong() {
    const songs = this.CurrentState.value.CurrentPlaylist.songs;
    const i = songs.findIndex((s) => s.path === this.CurrentState.value.CurrentSong.path);
    const prevIndex = (i - 1 + songs.length) % songs.length;
    return songs[prevIndex]?.path;
  }
}
