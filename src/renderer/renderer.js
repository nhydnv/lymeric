import { navigateTo } from './router.js';
import { currentToken } from './authorization.js';
import { FONTS } from './styles/fonts.js';

// Generate @font-face dynamically
Object.keys(FONTS).forEach(f => {
  const newFont = new FontFace(
    FONTS[f]['name'],
    `url("./../assets/fonts/${FONTS[f]['file']}") format("truetype")`,
    {
      weight: FONTS[f]['weight'],
      style: FONTS[f]['style'],
    },
  );
  newFont.load().then(() => {
    document.fonts.add(newFont);
  });
});

if (!window.localStorage.getItem('path') || 
    currentToken.access_token === 'undefined' || 
    currentToken.expires_in <= 5000) {
  await navigateTo('login');
} else {
  await navigateTo(window.localStorage.getItem('path'));
}