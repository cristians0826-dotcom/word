import { EmbedBuilder, SlashCommandBuilder, time } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Show information about a user.')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to look up (defaults to you).'),
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const member = interaction.guild
      ? await interaction.guild.members.fetch(user.id).catch(() => null)
      : null;

    const embed = new EmbedBuilder()
      .setColor(member?.displayColor || 0x5865f2)
      .setTitle(user.tag)
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields({ name: 'Account created', value: time(user.createdAt, 'R') })
      .setFooter({ text: `User ID: ${user.id}` });

    if (member) {
      embed.addFields({ name: 'Joined server', value: time(member.joinedAt, 'R') });

      // Skip @everyone, which every member has and nobody wants listed.
      const roles = member.roles.cache.filter((role) => role.id !== interaction.guild.id);
      if (roles.size > 0) {
        embed.addFields({
          name: `Roles (${roles.size})`,
          value: roles.map((role) => role.toString()).join(' ').slice(0, 1024),
        });
      }
    }

    await interaction.reply({ embeds: [embed] });
  },
};
