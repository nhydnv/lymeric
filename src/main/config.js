const path = require('node:path');
require('dotenv').config({ 
  path: path.join(__dirname, '../../.env'),
  quiet: true, 
});

const clientId = process.env.SPOTIFY_CLIENT_ID;
const protocol = "lymeric";
const redirectUri = `${protocol}://callback`;

module.exports = {
  clientId,
  protocol,
  redirectUri,
};