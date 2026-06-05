export const API_DEFAULT_PORT = 3001;
export const WEB_DEFAULT_PORT = 3000;

export const BOOKING_EXPIRY_MINUTES = 10;
export const MAX_NEARBY_VEHICLES = 20;
export const DEFAULT_SEARCH_RADIUS_KM = 2;

export type AppEnv = 'development' | 'production' | 'test';

export function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}
