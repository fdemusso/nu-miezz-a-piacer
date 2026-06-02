import Database from 'better-sqlite3'
import { mkdirSync } from 'fs'
import { join } from 'path'

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (_db) return _db
  const dataDir = join(process.cwd(), 'data')
  mkdirSync(dataDir, { recursive: true })
  _db = new Database(join(dataDir, 'dev.sqlite'))
  _db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      name TEXT NOT NULL,
      suspended INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      battery_level REAL NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      license_plate TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      vehicle_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      status TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS rides (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      vehicle_id TEXT NOT NULL,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      start_lat REAL NOT NULL,
      start_lng REAL NOT NULL,
      end_lat REAL,
      end_lng REAL,
      cost_amount REAL,
      cost_currency TEXT,
      paused INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS zones (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      boundary TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS fleet_zones (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      boundary TEXT NOT NULL,
      vehicle_count INTEGER NOT NULL DEFAULT 0,
      target_count INTEGER NOT NULL DEFAULT 0
    );
  `)
  return _db
}
