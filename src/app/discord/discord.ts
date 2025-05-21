import {
    ActivityType,
    Client,
    GatewayIntentBits,
    Partials,
    REST,
    Routes,
    SlashCommandBuilder,
} from 'discord.js';
import config from '../../config';
import path from 'node:path';
import fs from 'node:fs';
import { SlashCommand } from '../../builders/slashCommand';
import interactionCreate from '../../features/events/interactionCreate';
import { SubCommandHandler } from '../../builders/subcommandHandler';

export const DEFAULT_INTENTS = {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildPresences,
    ],
    partials: [Partials.User],
};

export const client = new Client(DEFAULT_INTENTS);
const clientREST = new REST({
    version: '10',
}).setToken(config.DISCORD_TOKEN);

export async function startDiscordBot() {
    client.on('ready', () => {
        console.log(`Logged in as ${client.user?.tag}!`);
    });

    client.on('interactionCreate', interactionCreate);

    await loadFeatures();
    await client.login(config.DISCORD_TOKEN);
    await registerFeatures();

    setActivity();
}

export function setActivity() {
    client.user?.setActivity({
        name: 'Discord Mafia',
        url: 'https://discord.gg/social-deduction',
        type: ActivityType.Playing,
    });
}

export async function loadFeatures() {
    const interactionPath = path.join(__dirname, '..', '..', 'features');
    const loadFiles = async (dirPath: string) => {
        try {
            const files = fs.readdirSync(dirPath);
            for (const file of files) {
                const filePath = path.join(dirPath, file);
                const stats = fs.statSync(filePath);
                if (stats.isDirectory()) {
                    await loadFiles(filePath); // Recursive call for subdirectories
                } else if (
                    stats.isFile() &&
                    (file.endsWith('.ts') || file.endsWith('.js'))
                ) {
                    try {
                        const _ = import(filePath);
                    } catch (err) {
                        console.log(
                            `\x1B[31mFailed to load file: \x1B[34m${file}\x1B[0m`,
                        );
                    }
                }
            }
        } catch (err) {
            console.log(
                `\x1B[31mFailed to load directory: \x1B[34m${interactionPath}\x1B[0m`,
            );
        }
    };

    await loadFiles(interactionPath);
    console.log('[BOT] Loaded interactions');
}

export async function registerFeatures() {
    try {
        const commandList: SlashCommandBuilder[] = [];
        SlashCommand.slashCommands.forEach((val) => {
            return commandList.push(val);
        });

        SubCommandHandler.subcommandHandlers.forEach((val) => {
            const tmp = val.build();
            if (tmp) return commandList.push(tmp);
        });

        const registeredCommands = (await clientREST.put(
            Routes.applicationCommands(config.DISCORD_CLIENT_ID),
            {
                body: commandList,
            },
        )) as unknown;

        if (Array.isArray(registeredCommands)) {
            if (registeredCommands.length != commandList.length) {
                console.log(
                    `\x1B[31mFailed to load ${commandList.length - registeredCommands.length
                    } commands`,
                );
            }
        }

        console.log(
            `[BOT] Registered ${(registeredCommands as any).length}/${commandList.length
            } commands`,
        );
    } catch (err) {
        console.error(err);
    }
}
