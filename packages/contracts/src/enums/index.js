"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingStatus = exports.RideStatus = exports.VehicleStatus = exports.VehicleType = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["RIDER"] = "RIDER";
    UserRole["OPERATOR"] = "OPERATOR";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var VehicleType;
(function (VehicleType) {
    VehicleType["SCOOTER"] = "SCOOTER";
    VehicleType["BIKE"] = "BIKE";
    VehicleType["MOPED"] = "MOPED";
    VehicleType["CAR"] = "CAR";
})(VehicleType || (exports.VehicleType = VehicleType = {}));
var VehicleStatus;
(function (VehicleStatus) {
    VehicleStatus["AVAILABLE"] = "AVAILABLE";
    VehicleStatus["IN_USE"] = "IN_USE";
    VehicleStatus["RESERVED"] = "RESERVED";
    VehicleStatus["MAINTENANCE"] = "MAINTENANCE";
    VehicleStatus["OFFLINE"] = "OFFLINE";
})(VehicleStatus || (exports.VehicleStatus = VehicleStatus = {}));
var RideStatus;
(function (RideStatus) {
    RideStatus["ACTIVE"] = "ACTIVE";
    RideStatus["PAUSED"] = "PAUSED";
    RideStatus["ENDED"] = "ENDED";
})(RideStatus || (exports.RideStatus = RideStatus = {}));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "PENDING";
    BookingStatus["CONFIRMED"] = "CONFIRMED";
    BookingStatus["ACTIVE"] = "ACTIVE";
    BookingStatus["CONVERTED_TO_RIDE"] = "CONVERTED_TO_RIDE";
    BookingStatus["COMPLETED"] = "COMPLETED";
    BookingStatus["CANCELLED"] = "CANCELLED";
    BookingStatus["EXPIRED"] = "EXPIRED";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
