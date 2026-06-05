"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrizzleRideRepository = void 0;
class DrizzleRideRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    async findById(_id) {
        return null;
    }
    async findActiveByUserId(_userId) {
        return null;
    }
    async create(_data) {
        throw new Error('Not implemented');
    }
    async updateStatus(_id, _status) {
        // TODO: implement
    }
    async end(_id, _data) {
        throw new Error('Not implemented');
    }
}
exports.DrizzleRideRepository = DrizzleRideRepository;
