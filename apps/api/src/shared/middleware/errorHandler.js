"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFound = notFound;
function errorHandler(err, _req, res, _next) {
    const statusCode = err.statusCode ?? 500;
    const message = statusCode === 500 ? 'Internal Server Error' : err.message;
    if (statusCode === 500) {
        console.error('[error]', err);
    }
    res.status(statusCode).json({ error: message });
}
function notFound(_req, res) {
    res.status(404).json({ error: 'Not found' });
}
