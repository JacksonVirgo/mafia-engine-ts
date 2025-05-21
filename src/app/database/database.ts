import { drizzle } from 'drizzle-orm/node-postgres';
import config from '../../config';
import { users } from '../../database/users';
import { serverFlags, servers } from '../../database/servers';
import { Pool } from 'pg';
import { signupEvents, signups, signupUsergroups } from '../../database/signups';
import { usergroupEvents, usergroups } from '../../database/usergroups';

const pool = new Pool({
    connectionString: config.DATABASE_URL,
});

export const db = drizzle({
    client: pool,
    schema: {
        users,
        servers,
        serverFeatureFlags: serverFlags,

        signups: signups,
        signupUsergroups,
        signupEvents,

        usergroups,
        usergroupEvents
    },
});

export type Database = typeof db;
