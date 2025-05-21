import { drizzle } from 'drizzle-orm/node-postgres';
import config from '../../config';
import { users } from '../../database/users';
import { serverFlags, servers } from '../../database/servers';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: config.DATABASE_URL,
});

export const db = drizzle({
    client: pool,
    schema: {
        users: users,
        servers: servers,
        serverFeatureFlags: serverFlags,
    },
});

export type Database = typeof db;
