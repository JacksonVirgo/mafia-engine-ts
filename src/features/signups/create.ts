import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { SubCommand } from "../../builders/subcommand";
import { InteractionError } from "../../utils/errors";
import { ButtonStyle } from "discord.js";
import { signups } from "../../database/signups";

export default new SubCommand('create')
    .setDescription('Create a new signup in this channel')
    .set((cmd) => cmd
        .addStringOption((o) =>
            o.setName('name').setDescription('Name of the signup')
        )
        .addIntegerOption((o) =>
            o
                .setName('limit')
                .setDescription('How many players do you want to sign up?')
        ))
    .onExecute(async (i, ctx) => {
        const guildId = i.guildId;
        const channelId = i.channelId;
        if (!(guildId && channelId)) throw new InteractionError("You need to be in a valid server text channel to use this command.");

        const initialMessage = await i.deferReply({ withResponse: true });
        const messageId = initialMessage.interaction.responseMessageId;
        if (!messageId) throw new InteractionError("Failed to create a signup message");

        const name = i.options.getString("name") ?? "Signups";
        const limit = i.options.getInteger("limit") ?? -1;

        const createdSignup = await ctx.db.insert(signups).values({
            channel_id: channelId,
            server_id: guildId,
            message_id: messageId
        }).returning();

        const refreshButton = new ButtonBuilder().setCustomId("refresh-signup").setStyle(ButtonStyle.Secondary).setEmoji({
            name: "🔃"
        })

        return await i.editReply({ content: `${name} - ${limit}`, components: [new ActionRowBuilder<ButtonBuilder>().addComponents(refreshButton)] })
    });
