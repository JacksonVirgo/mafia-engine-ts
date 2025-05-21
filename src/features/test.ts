import { SlashCommand } from '../builders/slashCommand';

export default new SlashCommand('test')
    .setDescription('Testing command')
    .onExecute(async (i) => {
        await i.reply('test');
    });
