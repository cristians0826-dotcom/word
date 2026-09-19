import 'dotenv/config';

/**
 * Reads the bot's configuration from the environment, reporting every missing
 * value at once rather than one failed start at a time.
 */
export function loadConfig() {
  const missing = ['DISCORD_TOKEN', 'CLIENT_ID'].filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(', ')}.\n` +
        'Copy .env.example to .env and fill it in.',
    );
  }

  return {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    // Optional: when present, commands register to this guild only, which
    // takes effect immediately instead of the global one-hour propagation.
    guildId: process.env.GUILD_ID || null,
  };
}
