import type { ChatInputCommandInteraction, Interaction } from 'discord.js';
import { SlashCommand } from '../../builders/slashCommand';
import { db } from '../../app/database/database';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function onInteraction(i: Interaction<any>) {
    switch (true) {
        case i.isChatInputCommand():
            return await handleSlashCommand(i as ChatInputCommandInteraction);
        default:
            console.log(
                `\x1B[31mUnknown interaction type: \x1B[34m${i.type}\x1B[0m`,
            );
            break;
    }
}

async function handleSlashCommand(i: ChatInputCommandInteraction) {
    const slashCommand = SlashCommand.slashCommands.get(i.commandName);
    if (!slashCommand) {
        return i.reply({
            content: 'This command does not exist',
            ephemeral: true,
        });
    }

    return await slashCommand.run(i, {
        db: db
    });
}
