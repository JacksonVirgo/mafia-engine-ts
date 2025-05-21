import {
    boolean,
    integer,
    pgTable,
    serial,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { snowflake } from './types/snowflake';

export const usergroups = pgTable('usergroups', {
    id: serial('id').primaryKey()
});

export const usergroupEvents = pgTable('usergroup_events', {
    id: serial('id').primaryKey(),
    usergroup_id: integer('usergroup_id').references(() => usergroups.id),
    name: varchar('name', {
        length: 32
    }),
    userRef: snowflake('user_ref_id').references(() => users.id),
    userAdded: boolean('user_add'),
    userRemoved: boolean('user_remove'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type UsergroupEvent = typeof usergroupEvents.$inferSelect;
