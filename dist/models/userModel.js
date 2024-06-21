"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class UserModel {
    static async createUser(data) {
        return database_1.default.user.create({ data });
    }
    static async getUserByEmail(email) {
        return database_1.default.user.findUnique({ where: { email } });
    }
    static async getAllUsers() {
        return database_1.default.user.findMany();
    }
}
exports.default = UserModel;
