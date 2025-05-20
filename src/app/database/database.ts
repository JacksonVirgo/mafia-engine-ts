import { drizzle } from 'drizzle-orm/node-postgres';
import config from '../../config';
import { users } from '../../database/users';
import { serverFlags, servers } from '../../database/servers';

export const db = drizzle(config.DATABASE_URL, {
	schema: {
		users: users,
		servers: servers,
		serverFeatureFlags: serverFlags,
	},
});
