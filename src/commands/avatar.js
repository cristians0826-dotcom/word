import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Show a user's avatar at full size.")
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user whose avatar to show (defaults to you).'),
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const url = user.displayAvatarURL({ size: 1024 });

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`${user.tag}'s avatar`)
      .setURL(url)
      .setImage(url);

    await interaction.reply({ embeds: [embed] });
  },
};
