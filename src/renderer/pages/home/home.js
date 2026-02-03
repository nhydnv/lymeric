import { currentToken, startRefreshToken } from '../../authorization.js';
import { navigateTo } from '../../router.js';
import { createInterval, fail, cleanUp } from './lifecycle.js';
import {
  enableEditBtns,
  disableEditBtns,
  initControls,
} from './controls/controls.js';
import { 
  checkSubscription, 
  enablePlayback, 
  disablePlayback, 
} from './playback.js';
import { displayLyrics, setLyricsDisplay } from './lyrics.js';

const LYRICS_INTERVAL_MS = 500;

const main = async () => {
  window.controls.setAlwaysOnTop(true);

  // Wire log out button first so users can log out without waiting for web player to be connected
  const logOutBtn = document.getElementById('log-out-btn');
  logOutBtn.addEventListener('click', () => {
    navigateTo('login');
    cleanUp();
  });

  // Reload button
  const reloadBtn = document.getElementById('reload-btn');
  reloadBtn.addEventListener('click', () => window.location.reload());

  // Wire up all components related to font, theme, and opacity controls
  initControls();

  if (!currentToken.access_token) { 
    fail();
    return;
  }
  startRefreshToken();

  // Disable playback based on on the user's Spotify subscription
  checkSubscription();

  // Loading "animation" while Puppeteer opens the web player
  let count = 0;
  const intervalId = setInterval(() => {
    setLyricsDisplay('', 'Connecting to Spotify' + '.'.repeat(count % 4), '');
    ++count;
  }, 500);

  disableEditBtns();                     // Disable edit buttons until web player is opened
  disablePlayback();                     // Disable playback buttons until web player is opened
  await window.spotify.openWebPlayer();  // Open web player
  clearInterval(intervalId);             // Stop loading animation
  enablePlayback();                      // Re-enable playback buttons
  enableEditBtns();                      // Re-enable edit buttons

  createInterval(displayLyrics, LYRICS_INTERVAL_MS);  // Poll every 500ms to detect song changes
};

main();