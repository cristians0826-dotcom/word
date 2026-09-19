import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { loadConfig } from './config.js';
import { loadCommands, loadEvents } from './loader.js';

let config;
try {
  config = loadConfig();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();
for (const [name, command] of await loadCommands()) {
  client.commands.set(name, command);
}
console.log(`Loaded ${client.commands.size} command(s).`);

for (const event of await loadEvents()) {
  const handler = (...args) => event.execute(...args, client);
  if (event.once) {
    client.once(event.name, handler);
  } else {
    client.on(event.name, handler);
  }
}

client.on('error', (error) => console.error('Client error:', error));
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

const shutdown = async (signal) => {
  console.log(`\nReceived ${signal}, shutting down.`);
  await client.destroy();
  process.exit(0);
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

await client.login(config.token);
