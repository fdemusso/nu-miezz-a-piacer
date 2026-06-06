"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrizzleUserRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../db/schema");
function rowToUser(row) {
    return {
        id: row.id,
        email: row.email,
        role: row.role,
        createdAt: row.createdAt,
    };
}
class DrizzleUserRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    async findById(id) {
        const rows = await this.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id)).limit(1);
        return rows[0] ? rowToUser(rows[0]) : null;
    }
    async findByEmail(email) {
        const rows = await this.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email)).limit(1);
        return rows[0] ? rowToUser(rows[0]) : null;
    }
    async create(_data) {
        throw new Error('Not implemented');
    }
}
exports.DrizzleUserRepository = DrizzleUserRepository;
