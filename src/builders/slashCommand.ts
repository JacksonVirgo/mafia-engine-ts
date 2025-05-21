import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandBuilder,
} from 'discord.js';
import { InteractionContext } from '../app/discord/context';
import { handleInteractionError, InteractionError } from '../utils/errors';
import { ServerFlag, serverFlags } from '../database/servers';
import { db } from '../app/database/database';
import { matchServerFeatureFlags } from '../utils/featureFlags';

export type SlashCommandExecution = (
    i: ChatInputCommandInteraction,
    ctx: InteractionContext,
) => unknown | Promise<unknown>;
export const defaultSlashCommandExecute: SlashCommandExecution = async (i, _ctx) => {
    await i.reply({
        content: 'This slash command has not been implemented yet.',
        ephemeral: true,
    });
};

export type SlashCommandAutocomplete = (
    i: AutocompleteInteraction,
) => unknown | Promise<unknown>;

export class SlashCommand extends SlashCommandBuilder {
    public static slashCommands = new Map<string, SlashCommand>();
    private featureFlags: ServerFlag[] = [];
    private executeFunc: SlashCommandExecution = defaultSlashCommandExecute;
    private autocompleteFunction?: SlashCommandAutocomplete;

    constructor(name: string) {
        super();
        this.setName(name);

        SlashCommand.slashCommands.set(name, this);
    }

    public setFeatureFlags(...featureFlags: ServerFlag[]) {
        this.featureFlags = featureFlags;
        return this;
    }

    public onExecute(executeFunc: SlashCommandExecution) {
        this.executeFunc = executeFunc;
        return this;
    }

    public onAutocomplete(autocompleteFunction: SlashCommandAutocomplete) {
        this.autocompleteFunction = autocompleteFunction;
        return this;
    }

    public async run(
        inter: ChatInputCommandInteraction,
        ctx: InteractionContext,
    ) {
        try {

            const serverId = inter.guildId;
            if (!serverId) throw new InteractionError("You must be in a server to use this command.")

            const permitted = await matchServerFeatureFlags(serverId, this.featureFlags);
            if (!permitted) throw new InteractionError("You do not have these features enabled on your server");

            await this.executeFunc(inter, ctx);
        } catch (err) {
            console.log(err);
            await handleInteractionError(err, inter);
        }
    }
}
