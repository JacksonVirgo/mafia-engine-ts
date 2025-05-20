import { varchar } from 'drizzle-orm/pg-core';

export function snowflake(name: string) {
	return varchar(name, {
		length: 32,
	});
}
