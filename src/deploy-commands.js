import { REST, Routes } from 'discord.js';
import { loadConfig } from './config.js';
import { loadCommands } from './loader.js';

const clear = process.argv.includes('--clear');

let config;
try {
  config = loadConfig();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const commands = clear
  ? []
  : [...(await loadCommands()).values()].map((command) => command.data.toJSON());

const rest = new REST().setToken(config.token);

const route = config.guildId
  ? Routes.applicationGuildCommands(config.clientId, config.guildId)
  : Routes.applicationCommands(config.clientId);
const scope = config.guildId ? `guild ${config.guildId}` : 'globally';

try {
  const data = await rest.put(route, { body: commands });
  console.log(`Registered ${data.length} command(s) ${scope}.`);
  if (!clear && !config.guildId) {
    console.log('Global commands can take up to an hour to appear.');
  }
} catch (error) {
  console.error('Failed to register commands:', error);
  process.exitCode = 1;
}
