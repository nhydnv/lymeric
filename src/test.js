const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
console.log(process.env.SPOTIFY_CLIENT_ID);