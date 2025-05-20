import {
	index,
	pgTable,
	serial,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';
import { snowflake } from './types/snowflake';
import { servers } from './servers';

export const users = pgTable(
	'users',
	{
		id: snowflake('id').primaryKey(),
		serverId: snowflake('server_id')
			.notNull()
			.references(() => servers.id),
		username: varchar('username', {
			length: 32,
		}).notNull(),

		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => [index('idx_discord_id_server_id').on(table.id, table.id)],
);
