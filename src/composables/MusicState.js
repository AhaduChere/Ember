import { ref } from 'vue';

export class MusicState {
  constructor() {
    this.MainFolder = ref({
      path: '',
      songs: [],
    });
    this.SubFolders = ref([]);
    this.IsPlaying = ref(false);
    this.loopMode = ref(0);
    this.shuffleMode = ref(false);
    this.CurrentState = ref({
      State: false,
      CurrentSong: { path: '', name: '', artist: '' },
      CurrentPlaylist: { path: '', songs: [], cover: '' },
    });
    this.audioSrc = ref('');
    this.sliderValue = ref();
    this.audioRef = ref(null);
  }

  async setupMainFolder() {
    this.MainFolder.value.path = await window.electronAPI.checkMusicFolder();
    this.MainFolder.value.songs = await window.electronAPI.loadSongs(this.MainFolder.value.path);
  }

  async setupSubFolders() {
    const array = await window.electronAPI.getFolders(this.MainFolder.value.path);
    for (let i = 0; i < array.length; i++) {
      const songs = await window.electronAPI.loadSongs(array[i]);
      const coverPath = await window.electronAPI.getFolderCover(array[i]);
      const buffer = await window.electronAPI.getFileBuffer(coverPath);
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      this.SubFolders.value.push({ path: array[i], songs, cover: url });
    }
  }

  async initializeCurrentState() {
    this.CurrentState.value.CurrentPlaylist = await window.electronAPI.loadSongs(this.MainFolder.value.path);
    this.CurrentState.value.CurrentPlaylist.path = this.MainFolder.value.path;
  }

  async updateCurrentState(path) {
    const songs = await window.electronAPI.loadSongs(path);
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
      if (this.CurrentState.value.CurrentPlaylist.cover) {
        URL.revokeObjectURL(this.CurrentState.value.CurrentPlaylist.cover);
      }
      this.CurrentState.value.CurrentPlaylist = songs;
      this.CurrentState.value.CurrentPlaylist.path = path;
      if (path !== this.MainFolder.value.path) {
        const coverPath = await window.electronAPI.getFolderCover(path);
        if (coverPath) {
          const buffer = await window.electronAPI.getFileBuffer(coverPath);
          const blob = new Blob([buffer], { type: 'image/jpeg' });
          this.CurrentState.value.CurrentPlaylist.cover = URL.createObjectURL(blob);
        }
      }
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

  async getMP3() {
    const filepath = this.CurrentState.value.CurrentSong.path;
    const buffer = await window.electronAPI.getFileBuffer(filepath);
    const blob = new Blob([buffer], { type: 'audio/mpeg' });
    if (this.audioSrc.value) {
      URL.revokeObjectURL(this.audioSrc.value);
    }
    this.audioSrc.value = URL.createObjectURL(blob);
  }

  async getNextSong() {
    if (this.shuffleMode.value == true) {
      const songs = this.CurrentState.value.CurrentPlaylist.songs;
      if (songs.length <= 1) return songs[0]?.path;

      let randomIndex;
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
