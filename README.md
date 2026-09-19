# Discord Bot

A Discord bot built with [discord.js](https://discord.js.org) v14 and slash commands.

## Commands

| Command | What it does |
| --- | --- |
| `/help` | Lists every command the bot knows |
| `/ping` | Round-trip and gateway latency |
| `/avatar [user]` | Shows a user's avatar at full size |
| `/userinfo [user]` | Account age, join date and roles |
| `/serverinfo` | Owner, member count, channels, roles, boosts |
| `/roll [sides] [count]` | Rolls dice, e.g. `/roll sides:20 count:2` |
| `/poll <question> <option1> <option2> …` | Reaction poll with up to 5 answers |
| `/scramble` | Word scramble game — guess through a button and modal |

## Setup

### 1. Create the application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and click **New Application**.
2. On **Bot**, click **Reset Token** and copy the token. Treat it like a password.
3. On **General Information**, copy the **Application ID**.

### 2. Configure

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

- `DISCORD_TOKEN` — the bot token from step 1
- `CLIENT_ID` — the application ID from step 1
- `GUILD_ID` — *optional.* Set it to a server ID while developing so command
  changes appear instantly. Leave it empty to register commands globally,
  which can take up to an hour to propagate.

### 3. Invite the bot

```bash
npm run invite
```

That prints an OAuth2 URL built from your `CLIENT_ID`, with the right scopes
and permissions already set. Open it, pick a server, authorize. You need
**Manage Server** on the server you choose.

It only reads `CLIENT_ID`, so you can run it before filling in the token.

<details>
<summary>Doing it by hand instead</summary>

In the developer portal under **OAuth2 → URL Generator**, tick the `bot` and
`applications.commands` scopes — without the second one the slash commands
never appear — then tick **View Channels**, **Send Messages**, **Embed
Links**, **Add Reactions** and **Read Message History**.

</details>

### 4. Register commands and run

```bash
npm run deploy   # register slash commands with Discord
npm start        # start the bot
```

`npm run deploy` only needs re-running when a command's name, description or
options change — not when you edit the code inside `execute`.

## Development

```bash
npm run dev          # restarts on file changes
npm run invite       # print the bot's invite URL
npm run deploy:clear # remove all registered commands
```

### Adding a command

Drop a file in `src/commands/`. It is picked up automatically on the next
start — there is no list to register it in.

```js
import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Say hello.'),

  async execute(interaction) {
    await interaction.reply('Hello!');
  },
};
```

Then run `npm run deploy` so Discord learns about it.

### Buttons and modals

A command can also export `handleComponent` to receive button clicks and modal
submissions. Give the component a custom ID of `<command-name>|<state>` and the
interaction is routed back to that command — see `src/commands/scramble.js`,
which stores the answer in the custom ID so the bot stays stateless across
restarts.

## Layout

```
src/
  index.js            client setup, event wiring, graceful shutdown
  config.js           environment loading and validation
  loader.js           auto-discovery of commands and events
  permissions.js      the permissions the bot needs, in one place
  deploy-commands.js  registers slash commands with Discord
  invite.js           prints the OAuth2 invite URL
  commands/           one file per slash command
  events/             one file per gateway event
  data/               static data (the word list)
```

## Notes

- The bot only requests the `Guilds` intent, so no privileged intents need
  enabling in the developer portal. If you add a feature that reads message
  text, you will need **Message Content Intent** there and the matching
  `GatewayIntentBits` entry in `src/index.js`.
- `.env` is gitignored. Never commit a bot token; if one leaks, reset it in the
  developer portal immediately.
