import {
    type ChatInputCommandInteraction,
    type AutocompleteInteraction,
    SlashCommandSubcommandBuilder,
} from 'discord.js';
import { handleInteractionError } from '../utils/errors';
import { InteractionContext } from '../app/discord/context';
import { SlashCommandExecution, defaultSlashCommandExecute, SlashCommandAutocomplete } from './slashCommand';

type SetFunc = (sub: SubCommand) => any;

export class SubCommand extends SlashCommandSubcommandBuilder {
    private executeFunction: SlashCommandExecution = defaultSlashCommandExecute;
    private autocompleteFunction?: SlashCommandAutocomplete;
    public name: string;
    constructor(name: string) {
        super();
        this.name = name;
        this.setName(name).setDescription('No description provided.');
    }

    public onExecute(executeFunction: SlashCommandExecution) {
        this.executeFunction = executeFunction;
        return this;
    }

    public onAutocomplete(autocompleteFunction: SlashCommandAutocomplete) {
        this.autocompleteFunction = autocompleteFunction;
        return this;
    }

    public set(func: SetFunc) {
        func(this);
        return this;
    }

    public async run(inter: ChatInputCommandInteraction, ctx: InteractionContext) {
        try {
            await this.executeFunction(inter, ctx);
        } catch (err) {
            await handleInteractionError(err, inter);
        }
    }

    public async autocomplete(inter: AutocompleteInteraction) {
        if (!this.autocompleteFunction) return;
        try {
            await this.autocompleteFunction(inter);
        } catch (err) {
            console.log(err);
        }
    }
}
