import {
    boolean,
    integer,
    pgTable,
    primaryKey,
    serial,
    varchar,
} from 'drizzle-orm/pg-core';
import { usergroups } from './usergroups';

export const signups = pgTable('signups', {
    id: serial('id').primaryKey(),
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
