import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js';

// Reaction voting keeps the bot stateless: Discord itself tallies the counts,
// so a restart never loses a poll.
const NUMBER_EMOJI = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];

const builder = new SlashCommandBuilder()
  .setName('poll')
  .setDescription('Start a reaction poll.')
  .addStringOption((option) =>
    option
      .setName('question')
      .setDescription('The question to ask.')
      .setRequired(true)
      .setMaxLength(256),
  );

// Two required choices, the rest optional.
for (let i = 0; i < NUMBER_EMOJI.length; i += 1) {
  builder.addStringOption((option) =>
    option
      .setName(`option${i + 1}`)
      .setDescription(`Answer ${i + 1}`)
      .setRequired(i < 2)
      .setMaxLength(100),
  );
}

export default {
  data: builder,

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const choices = NUMBER_EMOJI.map((_, i) =>
      interaction.options.getString(`option${i + 1}`),
    ).filter(Boolean);

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(question)
      .setDescription(
        choices.map((choice, i) => `${NUMBER_EMOJI[i]} ${choice}`).join('\n'),
      )
      .setFooter({ text: `Poll by ${interaction.user.tag}` });

    const message = await interaction.reply({
      embeds: [embed],
      withResponse: true,
    });

    try {
      for (let i = 0; i < choices.length; i += 1) {
        await message.resource.message.react(NUMBER_EMOJI[i]);
      }
    } catch (error) {
      console.error('Could not add poll reactions:', error);
      await interaction.followUp({
        content:
          'The poll was posted, but I could not add the reactions. ' +
          'Check that I have the "Add Reactions" permission here.',
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
