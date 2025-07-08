import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './db/schema';

export interface Context {
  config: {
    port: number;
    dbPath?: string;
  };
  db?: NodePgDatabase<typeof schema> | BetterSQLite3Database<typeof schema>;
}

export interface RequestContext {
  url: URL;
  query: Record<string, string>;
  params: Record<string, string>;
  body?: any;
}