import { OAuth2Scopes } from 'discord.js';
import { loadConfig } from './config.js';
import { REQUIRED_PERMISSIONS, permissionsBitfield } from './permissions.js';

let config;
try {
  // The token is irrelevant here — an invite URL is built from the public
  // application ID alone.
  config = loadConfig({ require: ['CLIENT_ID'] });
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

// applications.commands is what makes the slash commands visible; `bot` alone
// gets you a member that cannot be invoked.
const scope = [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands].join(' ');

// Built by hand rather than with URLSearchParams, which encodes the space
// between scopes as "+" where Discord's own generator emits "%20".
const query = Object.entries({
  client_id: config.clientId,
  scope,
  permissions: permissionsBitfield(),
})
  .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
  .join('&');

const url = `https://discord.com/api/oauth2/authorize?${query}`;

console.log('\nOpen this URL to add the bot to a server:\n');
console.log(url);
console.log(`\nPermissions requested (${permissionsBitfield()}):`);
for (const name of REQUIRED_PERMISSIONS) {
  console.log(`  - ${name}`);
}
console.log('\nYou need "Manage Server" on the server you pick.');
console.log('After inviting, run `npm run deploy` to register the commands.\n');
