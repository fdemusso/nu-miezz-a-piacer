import * as schema from './schema';
export declare const db: import("drizzle-orm/better-sqlite3").BetterSQLite3Database<typeof schema>;
export type Db = typeof db;
export declare function initDb(): Promise<void>;
