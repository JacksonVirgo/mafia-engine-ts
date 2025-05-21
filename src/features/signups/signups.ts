import { PermissionFlagsBits } from 'discord.js';
import { SubCommandHandler } from "../../builders/subcommandHandler";
import create from "./create";

export const signups = new SubCommandHandler('signups')
    .setDescription('Assorted commands to create and manage signups')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .attachSubcommand(create);
