const puppeteer = require('puppeteer');
const { getCookies } = require('./authorization');

const api = "https://api.spotify.com/v1";
let page;

const openWebPlayer = async (event) => {
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

  // Close the 'Allow cookies?' banner
  try {
    await page.locator('.onetrust-close-btn-handler.onetrust-close-btn-ui.banner-close-button.ot-close-icon').click();
  } catch (err) {
    if (err.name !== 'TimeoutError') {
      console.error(err);
    }
  }
};

const getLyrics = async (event, id) => {
  if (!page) return;

  await page.setCacheEnabled(false);

  const responsePromise = page.waitForResponse(res =>
    res.url().includes(`/color-lyrics/v2/track/${id}`) &&
    res.request().method() === 'GET' &&
    res.status() === 200
  );

  const lyricsButton = 'button[data-testid="lyrics-button"]';

  // Check if the track has lyrics, if yes, open lyrics tab
  const hasLyrics = await page.$eval(
    lyricsButton,
    el => !el.disabled,
  ).catch(() => false);
  if (!hasLyrics) return null;

  // Check that lyrics tab is not already opened
  const isActive = await page.$eval(
    lyricsButton,
    el => el?.getAttribute('data-active') === 'true',
  ).catch(() => false);
  if (!isActive) {
    await page.waitForSelector(lyricsButton, {
      visible: true,
    });
    await page.click(lyricsButton);
  }

  let lyrics;

  try {
    const response = await responsePromise;
    lyrics = await response?.json();
  } catch(err) {
    if (err.name === 'TimeoutError') {
      console.warn('Lyrics request timed out.');
    } else {
      throw err;
    }
  }

  return lyrics;
}

const getPlaybackState = async (event, token) => requestData(token, "/me/player");

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
  getPlaybackState,
  openWebPlayer,
  getLyrics,
}