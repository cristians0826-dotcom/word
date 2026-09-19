import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List every command the bot knows.'),

  async execute(interaction, client) {
    const commands = [...client.commands.values()].sort((a, b) =>
      a.data.name.localeCompare(b.data.name),
    );

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('Commands')
      .setDescription(
        commands
          .map((command) => `**/${command.data.name}** — ${command.data.description}`)
          .join('\n'),
      )
      .setFooter({ text: `${commands.length} commands` });

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },
};
