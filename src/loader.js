import { readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const srcDir = dirname(fileURLToPath(import.meta.url));

async function importAll(folder) {
  const dir = join(srcDir, folder);
  const files = (await readdir(dir)).filter((file) => file.endsWith('.js'));

  return Promise.all(
    files.map(async (file) => ({
      file: join(folder, file),
      module: await import(pathToFileURL(join(dir, file)).href),
    })),
  );
}

/**
 * Loads every command module in src/commands. Each module must default-export
 * an object with a `data` (SlashCommandBuilder) and an `execute` function.
 */
export async function loadCommands() {
  const commands = new Map();

  for (const { file, module } of await importAll('commands')) {
    const command = module.default;
    if (!command?.data || typeof command.execute !== 'function') {
      console.warn(`[loader] Skipping ${file}: missing "data" or "execute".`);
      continue;
    }
    commands.set(command.data.name, command);
  }

  return commands;
}

/**
 * Loads every event module in src/events. Each module must default-export an
 * object with a `name`, an optional `once` flag, and an `execute` function.
 */
export async function loadEvents() {
  const events = [];

  for (const { file, module } of await importAll('events')) {
    const event = module.default;
    if (!event?.name || typeof event.execute !== 'function') {
      console.warn(`[loader] Skipping ${file}: missing "name" or "execute".`);
      continue;
    }
    events.push(event);
  }

  return events;
}
