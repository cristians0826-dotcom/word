import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageFlags,
  ModalBuilder,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { WORDS } from '../data/words.js';

// The answer rides along in the custom ID, so a restart never orphans a game.
const ID_PREFIX = 'scramble';

function scramble(word) {
  const letters = [...word];

  // Fisher-Yates, repeated until the result actually differs from the word.
  for (let attempt = 0; attempt < 10; attempt += 1) {
    for (let i = letters.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    const shuffled = letters.join('');
    if (shuffled !== word) return shuffled;
  }

  return letters.join('');
}

export default {
  data: new SlashCommandBuilder()
    .setName('scramble')
    .setDescription('Unscramble a word.'),

  async execute(interaction) {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];

    const embed = new EmbedBuilder()
      .setColor(0xfee75c)
      .setTitle('Word scramble')
      .setDescription(`Unscramble this word:\n# ${scramble(word).toUpperCase()}`)
      .setFooter({ text: `${word.length} letters` });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`${ID_PREFIX}|${word}`)
        .setLabel('Guess')
        .setStyle(ButtonStyle.Primary),
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },

  // Called by the interactionCreate event for any component or modal whose
  // custom ID starts with "scramble|".
  async handleComponent(interaction) {
    const word = interaction.customId.slice(ID_PREFIX.length + 1);

    if (interaction.isButton()) {
      const modal = new ModalBuilder()
        .setCustomId(interaction.customId)
        .setTitle('Word scramble')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('guess')
              .setLabel('Your guess')
              .setStyle(TextInputStyle.Short)
              .setMaxLength(32)
              .setRequired(true),
          ),
        );

      await interaction.showModal(modal);
      return;
    }

    const guess = interaction.fields.getTextInputValue('guess').trim().toLowerCase();

    if (guess === word) {
      await interaction.reply(
        `✅ ${interaction.user} got it — the word was **${word}**.`,
      );
      return;
    }

    await interaction.reply({
      content: `❌ **${guess}** is not it. Try again.`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
