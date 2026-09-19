import { MessageFlags, SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check whether the bot is responsive and how fast it is.'),

  async execute(interaction, client) {
    const sent = await interaction.reply({
      content: 'Pinging...',
      flags: MessageFlags.Ephemeral,
      withResponse: true,
    });

    const roundTrip =
      sent.resource.message.createdTimestamp - interaction.createdTimestamp;

    await interaction.editReply(
      `Pong! Round trip: **${roundTrip}ms** · Gateway: **${Math.round(client.ws.ping)}ms**`,
    );
  },
};
