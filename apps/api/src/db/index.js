"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.initDb = initDb;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const better_sqlite3_2 = require("drizzle-orm/better-sqlite3");
const schema = __importStar(require("./schema"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const DB_PATH = process.env['DATABASE_URL'] ?? './data/mvp.db';
function createTables(sqlite) {
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
    const dir = path_1.default.dirname(DB_PATH);
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
    const sqlite = new better_sqlite3_1.default(DB_PATH);
    sqlite.pragma('journal_mode = WAL');
    sqlite.pragma('foreign_keys = ON');
    createTables(sqlite);
    return (0, better_sqlite3_2.drizzle)(sqlite, { schema });
}
exports.db = createDb();
async function initDb() {
    const { seedDemoData } = await Promise.resolve().then(() => __importStar(require('./seed')));
    await seedDemoData(exports.db);
}
