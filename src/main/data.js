const puppeteer = require('puppeteer');
const { getCookies } = require('./authorization');

const api = "https://api.spotify.com/v1";
let page;

const openWebPlayer = async () => {
  const cookies = getCookies();

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });
  [page] = await browser.pages();

  await page.goto("https://open.spotify.com");

  // Transform Electron cookies to Puppeteer cookies
  const puppeteerCookies = cookies.map(c => ({
    name: c.name,
    value: c.value,
    domain: c.domain,
    path: c.path || "/",
    secure: c.secure,
    httpOnly: c.httpOnly,
    sameSite: c.sameSite === "no_restriction" ? "None" :
              c.sameSite === "lax" ? "Lax" :
              c.sameSite === "strict" ? "Strict" : "Lax"
  }));

  // Set cookies on the page
  await browser.setCookie(...puppeteerCookies);

  // Reload to apply session cookies
  await page.reload({ waitUntil: "networkidle2" });
};

const getLyrics = async () => {
  if (!page) return;
  // Close the 'Allow cookies?' banner
  await page.locator('.onetrust-close-btn-handler.onetrust-close-btn-ui.banner-close-button.ot-close-icon').click();

  // Open lyrics tab
  await page.locator('button[data-testid="lyrics-button"]').click();
}

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
  getLyrics,
}