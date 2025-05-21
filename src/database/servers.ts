import { pgEnum, pgTable } from 'drizzle-orm/pg-core';
import { snowflake } from './types/snowflake';

export const servers = pgTable('servers', {
    id: snowflake('id').primaryKey(),
});

export const serverFeatureFlag = pgEnum('SERVER_FEATURE_FLAG', [
    'All',
    'Signup',
]);

export type ServerFlag = typeof serverFeatureFlag.enumValues[number];


export const serverFlags = pgTable('server_feature_flags', {
    id: snowflake('id').notNull(),
    featureFlag: serverFeatureFlag('flag').notNull(),
});
