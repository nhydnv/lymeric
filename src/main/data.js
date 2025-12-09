const puppeteer = require('puppeteer');
const { getCookies } = require('./authorization');

const api = "https://api.spotify.com/v1";

const openWebPlayer = async () => {
  const cookies = getCookies();  // Array of Electron cookies

  const browser = await puppeteer.launch({ headless: false });
  const [page] = await browser.pages();

  await page.goto("https://open.spotify.com");

  // Set cookies on the page
  await browser.setCookie(...cookies);

  // Reload to apply session cookies
  await page.reload({ waitUntil: "networkidle2" });
};

const getCurrentlyPlaying = async (event, token) => requestData(token, "/me/player/currently-playing");

const requestData = async (token, path) => {
  try {
    const response = await fetch(`${api}${path}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    } else if (response.status === 204) {  // No active Spotify device
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {
  getCurrentlyPlaying,
  openWebPlayer,
}