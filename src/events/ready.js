import { ActivityType, Events } from 'discord.js';

export default {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Logged in as ${client.user.tag}.`);
    console.log(`Serving ${client.guilds.cache.size} server(s).`);

    client.user.setActivity('/help', { type: ActivityType.Listening });
  },
};
