import { startDiscordBot } from './app/discord/discord';
import { Logger } from './utils/logger';

(async () => {
    await startDiscordBot();

    new Logger().debug("Fuck");

})();
