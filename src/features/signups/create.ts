import { SubCommand } from "../../builders/subcommand";

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
    .onExecute(async (i) => {
        return await i.reply({ content: "Hello" });
    });
