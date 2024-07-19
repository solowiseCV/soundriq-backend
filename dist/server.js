"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = require("./config/index").PORT;
const HOST = require("./config/index").HOST;
app_1.default.listen(PORT, () => {
    console.log(`🚀 Server is running on ${HOST}:${PORT}`);
});
