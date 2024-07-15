"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const status_1 = __importDefault(require("./routes/status"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const fileRoutes_1 = __importDefault(require("./routes/fileRoutes"));
// import artistRouter from "./routes/artistRoutes";
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const swagger_1 = __importDefault(require("./swagger/swagger"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// Middleware to parse URL-encoded data 
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/auth", authRoutes_1.default);
// app.use("/artist", artistRouter);
app.use("/", status_1.default);
app.use("/files", fileRoutes_1.default);
(0, swagger_1.default)(app);
app.use(errorHandler_1.default);
exports.default = app;
