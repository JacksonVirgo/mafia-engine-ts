import {
    AutocompleteInteraction,
    SlashCommandBuilder,
    type ChatInputCommandInteraction,
} from 'discord.js';
import { SubCommand } from './subcommand';
import { InteractionError } from '../utils/errors';
import { ServerFlag } from '../database/servers';
import { matchServerFeatureFlags } from '../utils/featureFlags';
import { InteractionContext } from '../app/discord/context';

export class SubCommandHandler extends SlashCommandBuilder {
    public static subcommandHandlers = new Map<string, SubCommandHandler>();
    private featureFlags: ServerFlag[] = [];
    private subcommands = new Map<string, SubCommand>();
    constructor(name: string) {
        super();
        if (SubCommandHandler.subcommandHandlers.has(name))
            throw new Error(`Subcommand Handler ${name} already exists.`);
        this.setName(name).setDescription('No description provided.');
        SubCommandHandler.subcommandHandlers.set(name, this);
    }

    public setFeatureFlags(...featureFlags: ServerFlag[]) {
        this.featureFlags = featureFlags;
        return this;
    }

    public attachSubcommand(subcommand: SubCommand) {
        if (!subcommand) return this;
        this.subcommands.set(subcommand.toJSON().name, subcommand);
        return this;
    }

    public getSubCommands() {
        return this.subcommands;
    }

    public async run(inter: ChatInputCommandInteraction, ctx: InteractionContext) {
        const subcommandHandle = inter.options.getSubcommand();
        if (!subcommandHandle)
            throw new InteractionError('No subcommand provided');

        const subcommand = this.subcommands.get(subcommandHandle);
        if (!subcommand)
            throw new InteractionError('Invalid subcommand provided');

        const serverId = inter.guildId;
        if (!serverId) throw new InteractionError("You must be in a server to use this command.")

        const permitted = await matchServerFeatureFlags(serverId, this.featureFlags);
        if (!permitted) throw new InteractionError(`Feature cannot be used as you are missing at least one of the following permissions: ${this.featureFlags.join(", ").toUpperCase()}`);

        await subcommand.run(inter, ctx);
    }

    public async onAutocomplete(inter: AutocompleteInteraction) {
        const subcommandHandle = inter.options.getSubcommand();
        if (!subcommandHandle)
            throw new InteractionError('No subcommand provided');

        const subcommand = this.subcommands.get(subcommandHandle);
        if (!subcommand)
            throw new InteractionError('Invalid subcommand provided');

        if (!subcommand.onAutocomplete)
            throw new InteractionError('Subcommand has no onAutocomplete');

        return await subcommand.autocomplete(inter);
    }

    public build() {
        const builder = this.setName(this.name);
        for (const subcommand of this.subcommands.values()) {
            builder.addSubcommand(subcommand);
        }
        return builder;
    }
}
