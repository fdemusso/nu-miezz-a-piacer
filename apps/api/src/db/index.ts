import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env['DATABASE_URL'] ?? './data/mvp.db';

function createTables(sqlite: Database.Database): void {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'AVAILABLE',
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      battery_level INTEGER NOT NULL DEFAULT 100,
      battery_range_km REAL NOT NULL DEFAULT 0,
      model TEXT NOT NULL,
      license_plate TEXT,
      image_url TEXT,
      specs_json TEXT NOT NULL DEFAULT '{}',
      features_json TEXT NOT NULL DEFAULT '{}',
      pricing_json TEXT NOT NULL DEFAULT '{}'
    );
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL DEFAULT 'RIDER',
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      vehicle_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING',
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      confirmed_at INTEGER,
      cancelled_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS rides (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      vehicle_id TEXT NOT NULL,
      booking_id TEXT,
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      started_at INTEGER NOT NULL,
      ended_at INTEGER,
      start_lat REAL NOT NULL,
      start_lng REAL NOT NULL,
      end_lat REAL,
      end_lng REAL,
      distance_km REAL,
      duration_minutes REAL,
      total_cost_amount REAL,
      total_cost_currency TEXT
    );
  `);
}

function createDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const sqlite = new Database(DB_PATH);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  createTables(sqlite);

  return drizzle(sqlite, { schema });
}

export const db = createDb();
export type Db = typeof db;

export async function initDb(): Promise<void> {
  const { seedDemoData } = await import('./seed');
  await seedDemoData(db);
}
