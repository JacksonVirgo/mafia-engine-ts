import {
    boolean,
    integer,
    pgTable,
    serial,
    varchar,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { snowflake } from './types/snowflake';

export const usergroups = pgTable('usergroups', {
    id: serial('id').primaryKey()
});


export const usergroupEvents = pgTable('usergroup_events', {
    id: serial('id').primaryKey(),
    name: varchar('name', {
        length: 32
    }),
    userRef: snowflake('user_ref_id').references(() => users.id),
    userAdded: boolean('user_add'),
    userRemoved: boolean('user_remove'),
});
