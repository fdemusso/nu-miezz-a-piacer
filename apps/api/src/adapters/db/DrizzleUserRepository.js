"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrizzleUserRepository = void 0;
class DrizzleUserRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    async findById(_id) {
        return null;
    }
    async findByEmail(_email) {
        return null;
    }
    async create(_data) {
        throw new Error('Not implemented');
    }
}
exports.DrizzleUserRepository = DrizzleUserRepository;
