import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof postgres> | undefined;
};

function makeClient() {
  return postgres(process.env.DATABASE_URL!, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 30,
    max_lifetime: 60 * 30,
    connection: { application_name: 'skillstube' },
  });
}

const client = globalForDb.client ?? makeClient();
if (process.env.NODE_ENV !== 'production') globalForDb.client = client;

export const db = drizzle(client, { schema });
