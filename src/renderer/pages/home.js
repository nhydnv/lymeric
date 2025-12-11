import { currentToken } from './../authorization.js';

const songTitle = document.getElementById('song-title');

await window.spotify.openWebPlayer();
await window.spotify.getLyrics();

// get name of the currenly playing track
setInterval(async () => {
  if (!currentToken.access_token) { throw new Error('Access token required.'); }

  const currentlyPlaying = await window.api.getCurrentlyPlaying(currentToken.access_token);
  if (currentlyPlaying) {
    const song = currentlyPlaying['item']['name'];
    const artists = currentlyPlaying['item']['artists'].map(artist => artist['name']);

    songTitle.textContent = song; 

    if (currentlyPlaying['is_playing']) {
    } else {
    }
  } else {
    // 204 no content: try relaunching spotify app
    songTitle.textContent = 'Start playing sth (or try relaunching ur spotify app)';
  }
}, 1000);  // Query every second