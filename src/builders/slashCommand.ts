import {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from 'discord.js';
import { InteractionContext } from '../app/discord/context';
import { handleInteractionError } from '../utils/errors';

export type SlashCommandExecution = (
	i: ChatInputCommandInteraction,
	ctx: InteractionContext,
) => unknown | Promise<unknown>;
const defaultSlashCommandExecute: SlashCommandExecution = async (i, _ctx) => {
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
	private featureFlags: string[] = [];
	private executeFunc: SlashCommandExecution = defaultSlashCommandExecute;
	private autocompleteFunction?: SlashCommandAutocomplete;

	constructor(name: string) {
		super();
		this.setName(name);

		SlashCommand.slashCommands.set(name, this);
	}

	public setFeatureFlags(...featureFlags: string[]) {
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
			await this.executeFunc(inter, ctx);
		} catch (err) {
			await handleInteractionError(err, inter);
		}
	}
}
