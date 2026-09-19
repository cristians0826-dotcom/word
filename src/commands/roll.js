import { SlashCommandBuilder } from 'discord.js';

const MAX_DICE = 25;
const MAX_SIDES = 1000;

export default {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll some dice.')
    .addIntegerOption((option) =>
      option
        .setName('sides')
        .setDescription('Number of sides per die (default 6).')
        .setMinValue(2)
        .setMaxValue(MAX_SIDES),
    )
    .addIntegerOption((option) =>
      option
        .setName('count')
        .setDescription('Number of dice to roll (default 1).')
        .setMinValue(1)
        .setMaxValue(MAX_DICE),
    ),

  async execute(interaction) {
    const sides = interaction.options.getInteger('sides') ?? 6;
    const count = interaction.options.getInteger('count') ?? 1;

    const rolls = Array.from(
      { length: count },
      () => 1 + Math.floor(Math.random() * sides),
    );
    const total = rolls.reduce((sum, roll) => sum + roll, 0);

    const detail = count > 1 ? ` (${rolls.join(' + ')})` : '';
    await interaction.reply(`🎲 ${count}d${sides} → **${total}**${detail}`);
  },
};
