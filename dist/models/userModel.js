"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.findUserByEmail = exports.createUser = void 0;
const database_1 = __importDefault(require("../config/database"));
const createUser = async (data) => {
    return await database_1.default.user.create({ data });
};
exports.createUser = createUser;
const findUserByEmail = async (email) => {
    return await database_1.default.user.findUnique({ where: { email } });
};
exports.findUserByEmail = findUserByEmail;
const getAllUsers = async () => {
    return await database_1.default.user.findMany();
};
exports.getAllUsers = getAllUsers;
