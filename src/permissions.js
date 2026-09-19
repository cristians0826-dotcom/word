import { PermissionFlagsBits } from 'discord.js';

/**
 * The permissions the bot's commands actually need. Keeping this in one place
 * means the invite URL and the documentation cannot drift apart, and adding a
 * command that needs more access is a one-line change here.
 *
 * - ViewChannel/SendMessages: reply to commands at all
 * - EmbedLinks: /help, /userinfo, /serverinfo, /avatar, /poll
 * - AddReactions + ReadMessageHistory: /poll's vote reactions
 */
export const REQUIRED_PERMISSIONS = [
  'ViewChannel',
  'SendMessages',
  'EmbedLinks',
  'AddReactions',
  'ReadMessageHistory',
];

/** The permissions above as the integer Discord's OAuth2 URL expects. */
export function permissionsBitfield() {
  return REQUIRED_PERMISSIONS.reduce(
    (total, name) => total | PermissionFlagsBits[name],
    0n,
  ).toString();
}
