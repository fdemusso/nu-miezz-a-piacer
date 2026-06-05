export declare const API_DEFAULT_PORT = 3001;
export declare const WEB_DEFAULT_PORT = 3000;
export declare const BOOKING_EXPIRY_MINUTES = 10;
export declare const MAX_NEARBY_VEHICLES = 20;
export declare const DEFAULT_SEARCH_RADIUS_KM = 2;
export type AppEnv = 'development' | 'production' | 'test';
export declare function getEnv(key: string, fallback?: string): string;
