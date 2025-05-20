import { z } from 'zod';
import 'dotenv/config';

export const envConfig = z.object({
	DATABASE_URL: z.string(),
	DISCORD_TOKEN: z.string(),
	DISCORD_CLIENT_ID: z.string(),
	ADMIN_SERVER_ID: z.string().optional(),
});

export default (() => {
	return envConfig.parse(process.env);
})();
