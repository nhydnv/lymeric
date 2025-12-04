/*
---------- Constants ----------
*/
let clientId;
let redirectUri;
const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing streaming';

const TOKEN_CHECK = 30_000;           // Check token expiry every 30s
const TOKEN_MIN_TIME_LEFT = 12000000;  // Refresh token if current token expires in less than 2 minutes

// Data structure that manages the current active token, caching it in localStorage
const currentToken = {
  save: function (response) {
    const { access_token, refresh_token, expires_in } = response;
    window.localStorage.setItem('access_token', access_token);
    window.localStorage.setItem('refresh_token', refresh_token);
    window.localStorage.setItem('expires_in', expires_in);

    const now = new Date();
    const expiry = new Date(now.getTime() + (expires_in * 1000));
    window.localStorage.setItem('expires', expiry);
  },
  get access_token() { return window.localStorage.getItem('access_token') || null; },
  get refresh_token() { return window.localStorage.getItem('refresh_token') || null; },
  get expires_in() { return window.localStorage.getItem('expires_in') || null },
  get expires() { return window.localStorage.getItem('expires') || null },
};

/*
---------- Authorisation flow ----------
*/
const redirectToSpotifyAuthorize = async () =>  {
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
  window.spotify.openAuthWindow(authUrl.toString());
}

// Exchange authorization code for an access token by sending a POST request to /api/token
const getToken = async code => {
  // Stored during authorization request
  const codeVerifier = window.localStorage.getItem('code_verifier');

  const url = "https://accounts.spotify.com/api/token";
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

  currentToken.save(await response.json());
}

// Refresh token once the current access token expires
const refreshToken = async () => {
  const refreshToken = currentToken.refresh_token;

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: currentToken.refresh_token
    }),
  });

  currentToken.save(await response.json());
}

const startRefreshToken = async code => {
  // Check every 30 seconds
  setInterval(async () => {
    const timeLeft = currentToken.expires - Date.now();

    // Refresh if there is less than 2 minutes left
    if (timeLeft < TOKEN_MIN_TIME_LEFT) {
      console.log("Refreshing token")
      await refreshToken();
    }
  }, TOKEN_CHECK);
}

const loginWithSpotifyClick = () => {
  redirectToSpotifyAuthorize();
}

/*
---------- Utility functions ----------
*/
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

/*
---------- Authorisation script ----------
*/
export const authorize = () => {
  return new Promise(async (resolve, reject) => {
    clientId = await window.spotify.getClientId();
    redirectUri = await window.spotify.getRedirectUri();
    loginWithSpotifyClick();

    // On redirect, receive authorisation code and state sent by the main process
    window.spotify.onAuthCode(async (data) => {
      try {
        const code = data['code'];
        const state = data['state'];

        if (!code) {
          window.spotify.closeAuthWindow();
          return resolve(false);
        }

        // If a code is found, we're in a callback, do a token exchange
        // Compare the state parameter received in the redirection URI
        // with the state parameter originally provided to Spotify in the authorization URI
        const storedState = window.localStorage.getItem('state');
        if (state != storedState) {
          console.error("State mismatch.");
          throw new Error("State mismatch.");
        }

        await getToken(code);

        // Remove query parameters from URL so we can refresh correctly
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        url.searchParams.delete("state");

        const updatedUrl = url.search ? url.href : url.href.replace('?', '');
        window.history.replaceState({}, "", updatedUrl);

        // If we have a token (we're logged in), return true;
        if (currentToken.access_token) {
          startRefreshToken();
          window.spotify.closeAuthWindow();
          return resolve(true);
        }
        window.spotify.closeAuthWindow();
        resolve(false);
      } catch (err) { reject(err); }
    });
  });
}