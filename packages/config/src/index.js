"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SEARCH_RADIUS_KM = exports.MAX_NEARBY_VEHICLES = exports.BOOKING_EXPIRY_MINUTES = exports.WEB_DEFAULT_PORT = exports.API_DEFAULT_PORT = void 0;
exports.getEnv = getEnv;
exports.API_DEFAULT_PORT = 3001;
exports.WEB_DEFAULT_PORT = 3000;
exports.BOOKING_EXPIRY_MINUTES = 10;
exports.MAX_NEARBY_VEHICLES = 20;
exports.DEFAULT_SEARCH_RADIUS_KM = 2;
function getEnv(key, fallback) {
    const value = process.env[key] ?? fallback;
    if (value === undefined) {
        throw new Error(`Missing required env var: ${key}`);
    }
    return value;
}
