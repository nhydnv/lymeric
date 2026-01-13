const theme = (name, textPrimary, textSecondary, background) => ({
  name,
  'text-primary': textPrimary,
  'text-secondary': textSecondary,
  background,
});

export const THEMES = {
  dark: theme(
    'Dark', 
    'white', 
    '#a0a0a0', 
    '#191919'
  ),
  light: theme(
    'Light', 
    '#191919', 
    '#797979', 
    'white'
  ),
  cafe: theme(
    'Cafe',
    '#ffe8bf', 
    '#cd925e', 
    '#1c0904'),
  olive: theme(
    'Olive',
    '#cbd628',
    '#957a29',
    '#330312'
  ),
  alarm: theme(
    'Alarm',
    '#ff5640',
    '#ae200d',
    '#0a104fff',
  ),
  blueberry: theme(
    'Blueberry cheesecake',
    '#0d3b66',
    '#356c9f',
    '#faf0ca',
  ),
  perfume: theme(
    'Perfume',
    '#66023c',
    '#91386c',
    '#cad183',
  ),
  berry: theme(
    'Berry',
    '#70020f',
    '#b73241',
    '#ffdee2',
  ),
  lavender: theme(
    'Lavender',
    '#f8f4ff',
    '#d9c8f5ff',
    '#a599c9',
  ),
  special: theme(
    '',
    'transparent',
    'transparent',
    'transparent',
  ),
}