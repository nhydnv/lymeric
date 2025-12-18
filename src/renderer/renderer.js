import { navigateTo } from './router.js';

await navigateTo('login');

// Window controls logic
const closeBtn = document.querySelector("#close");
const minBtn = document.querySelector("#min");

closeBtn.addEventListener("click", () => window.controls.closeWindow());
minBtn.addEventListener("click", () => window.controls.minimizeWindow());