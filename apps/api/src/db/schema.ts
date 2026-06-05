import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

// Minimal schema bootstrap — full schema added per slice in future prompts

export const vehicles = sqliteTable('vehicles', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  status: text('status').notNull().default('AVAILABLE'),
  lat: real('lat').notNull(),
  lng: real('lng').notNull(),
  batteryLevel: integer('battery_level').notNull().default(100),
  batteryRangeKm: real('battery_range_km').notNull().default(0),
  model: text('model').notNull(),
  licensePlate: text('license_plate'),
  imageUrl: text('image_url'),
  specsJson: text('specs_json').notNull().default('{}'),
  featuresJson: text('features_json').notNull().default('{}'),
  pricingJson: text('pricing_json').notNull().default('{}'),
});

export const bookings = sqliteTable('bookings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  vehicleId: text('vehicle_id').notNull(),
  status: text('status').notNull().default('PENDING'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  confirmedAt: integer('confirmed_at', { mode: 'timestamp' }),
  cancelledAt: integer('cancelled_at', { mode: 'timestamp' }),
});

export const rides = sqliteTable('rides', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  vehicleId: text('vehicle_id').notNull(),
  bookingId: text('booking_id'),
  status: text('status').notNull().default('ACTIVE'),
  startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
  endedAt: integer('ended_at', { mode: 'timestamp' }),
  startLat: real('start_lat').notNull(),
  startLng: real('start_lng').notNull(),
  endLat: real('end_lat'),
  endLng: real('end_lng'),
  distanceKm: real('distance_km'),
  durationMinutes: real('duration_minutes'),
  totalCostAmount: real('total_cost_amount'),
  totalCostCurrency: text('total_cost_currency'),
});

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('RIDER'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
