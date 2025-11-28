const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const clientId = process.env.SPOTIFY_CLIENT_ID;
const redirectUri = 'http://127.0.0.1:8080/callback';

const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing streaming';

// On page load, try to fetch auth code from current browser search URL
const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');

// If a code is found, we're in a callback, do a token exchange
if (code) {
  // Compare the state parameter received in the redirection URI
  // with the state parameter originally provided to Spotify in the authorization URI
  const storedState = window.localStorage.getItem('state');
  let returnedState = urlParams.get('state');
  if (returnedState != storedState) {
    console.error("State mismatch.");
    throw new Error("State mismatch.");
  }
}

async function redirectToSpotifyAuthorize() {
  // Code verifier - generates a random string between 43 and 128 characters long
  const codeVerifier = generateRandomString(64);

  // Code challenge - hash the code verifier using sha256 and encode into base64
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  const state = generateRandomString(16);
  window.localStorage.setItem('state', state);

  const authUrl = new URL(authorizationEndpoint)

  // Store the code verifier because of redirect; send along with authorization code later
  window.localStorage.setItem('code_verifier', codeVerifier);

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
  window.location.href = authUrl.toString();
}

const loginWithSpotifyClick = () => {
  redirectToSpotifyAuthorize();
}

const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const sha256 = async (plain) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

loginWithSpotifyClick();