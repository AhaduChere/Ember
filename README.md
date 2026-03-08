<p align="center">
  <img src="src/assets/Icon.png" alt="Ember Logo" width="150">
</p>
<h1 align="center">Ember</h1>
<p align="center"><em>A local file music player I built for practice</em></p>
<p align="center">
  <img src="https://img.shields.io/badge/Electron-47848F?logo=electron&logoColor=white&style=for-the-badge" alt="Electron">
  <img src="https://img.shields.io/badge/Vue.js-4FC08D?logo=vue.js&logoColor=white&style=for-the-badge" alt="Vue.js">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwind-css&logoColor=white&style=for-the-badge" alt="Tailwind CSS">
</p>

<h4>How to Use</h4>
<ul>
  <li>Ember reads from your system's default Music folder</li>
  <li>Subfolders inside your Music folder are treated as playlists</li>
  <li>Songs are named using the format <code>Song Title | Artist Name.mp3</code></li>
  <li>Cover art for a playlist can be used by adding it as <code>cover.jpg</code> or <code>cover.png</code> inside the playlist folder</li>
</ul>

<h4>Example Folder Setup</h4>

<pre>
~/Music/
  ├── Playlist/
  │   ├── cover.jpg
  │   ├── Song Title | Artist Name.mp3
  │   └── Song Title | Artist Name.mp3
  └── Another Playlist/
      ├── cover.png
      └── Song Title | Artist Name.mp3
</pre>
