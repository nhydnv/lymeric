const { BrowserWindow } = require('electron');
const path = require('node:path');
const { clientId, redirectUri } = require('./config');

const AUTH_WINDOW_WIDTH = 600;
const AUTH_WINDOW_HEIGHT = 800;

const tokenEndpoint = "https://accounts.spotify.com/api/token";
const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing streaming';

let authWindow;
let cookies;

const openAuthWindow = (url) => {
  // Prevents opening multiple auth windows
  if (authWindow && !authWindow.isDestroyed()) {
    authWindow.focus();
    authWindow.loadURL(url);
    return;
  }

  authWindow = new BrowserWindow({
    width: AUTH_WINDOW_WIDTH,
    height: AUTH_WINDOW_HEIGHT,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/preload.js'),
    },
  });

  authWindow.loadURL(url);
  authWindow.setMenuBarVisibility(false);
  authWindow.webContents.on('did-finish-load', () => {
    setCookies();
  });

  authWindow.on('close', () => {
    setCookies(); 
  });

  // Clean up
  authWindow.on('closed', () => {
    authWindow = null;
  });
}

const closeAuthWindow = event => { authWindow.close(); }

const getToken = async (event, code, codeVerifier) => {
  const url = tokenEndpoint;
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  }

  const response = await fetch(url, payload);
  return await response.json();
}

// Refresh token once the current access token expires
const refreshToken = async (refreshToken) => {
  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });
  return await response.json();
}

const redirectToSpotifyAuthorize = async (event, codeChallenge, state) =>  {
  const authUrl = new URL(authorizationEndpoint);

  const params =  {
      response_type: 'code',
      client_id: clientId,
      scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
      state: state,
  }

  authUrl.search = new URLSearchParams(params).toString();
  openAuthWindow(authUrl.toString());
}

const setCookies = () => {
  if (!authWindow) return;
  authWindow.webContents.session.cookies.get({})
  .then(result => {
    cookies = result;
  });
}

module.exports = {
  getAuthWindow: () => authWindow,
  getCookies: () => cookies,
  closeAuthWindow,
  redirectToSpotifyAuthorize,
  getToken,
  refreshToken,
};