import { navigateTo } from './router.js';
import { currentToken } from './authorization.js';

if (!window.localStorage.getItem('path') || 
    currentToken.access_token === 'undefined' || 
    currentToken.expires_in <= 5000) {
  await navigateTo('login');
} else {
  await navigateTo(window.localStorage.getItem('path'));
}

// Window controls logic
const closeBtn = document.querySelector("#close");
const minBtn = document.querySelector("#min");

if (closeBtn) closeBtn.addEventListener("click", () => window.controls.closeWindow());
if (minBtn) minBtn.addEventListener("click", () => window.controls.minimizeWindow());