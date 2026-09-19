import { Events, MessageFlags } from 'discord.js';

/**
 * Buttons and modals carry a custom ID shaped as "<command>|<state>", which is
 * how a component gets routed back to the command that created it.
 */
function resolveComponentCommand(interaction, client) {
  const [name] = interaction.customId.split('|');
  const command = client.commands.get(name);
  return typeof command?.handleComponent === 'function' ? command : null;
}

export default {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    let run;

    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) {
        console.warn(`Received unknown command: ${interaction.commandName}`);
        return;
      }
      run = () => command.execute(interaction, client);
    } else if (interaction.isButton() || interaction.isModalSubmit()) {
      const command = resolveComponentCommand(interaction, client);
      if (!command) return;
      run = () => command.handleComponent(interaction, client);
    } else {
      return;
    }

    try {
      await run();
    } catch (error) {
      console.error(`Error handling interaction ${interaction.id}:`, error);

      const response = {
        content: 'Something went wrong while handling that.',
        flags: MessageFlags.Ephemeral,
      };

      // A modal can only be shown on an unacknowledged interaction, so once we
      // are past that point the reply has to become a follow-up.
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(response).catch(() => {});
      } else {
        await interaction.reply(response).catch(() => {});
      }
    }
  },
};
