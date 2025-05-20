import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/database/*',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
