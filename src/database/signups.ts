import {
    boolean,
    integer,
    pgTable,
    primaryKey,
    serial,
    varchar,
} from 'drizzle-orm/pg-core';
import { usergroups } from './usergroups';
import { snowflake } from './types/snowflake';
import { servers } from './servers';

export const signups = pgTable('signups', {
    id: serial('id').primaryKey(),
    server_id: snowflake('server_id').notNull().references(() => servers.id),
    channel_id: snowflake('channel_id').notNull(),
    message_id: snowflake('message_id').notNull()
});


export const signupUsergroups = pgTable('signup_usergroups', {
    signup_id: integer('signup_id').references(() => signups.id),
    usergroup_id: integer('usergroup_id').references(() => usergroups.id),
}, (t) => [
    primaryKey({
        columns: [t.signup_id, t.usergroup_id]
    })
]);

export const signupEvents = pgTable('signup_events', {
    id: serial('id').primaryKey(),
    signup_id: integer('signup_id').references(() => signups.id),
    name: varchar('name', { length: 32 }),
    isAnonymous: boolean('is_anonymous'),
    usergroupRef: integer('usergroup_ref_id').references(() => usergroups.id),
    hoistUsergroup: boolean('hoist_usergroup')
})
