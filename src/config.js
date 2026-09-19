import 'dotenv/config';

/**
 * Reads the bot's configuration from the environment, reporting every missing
 * value at once rather than one failed start at a time.
 *
 * `require` lists the variables this particular entrypoint cannot run without.
 * Generating an invite URL needs only the application ID, for instance, so it
 * should not fail on a missing token.
 */
export function loadConfig({ require = ['DISCORD_TOKEN', 'CLIENT_ID'] } = {}) {
  const missing = require.filter((name) => !process.env[name]);

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
