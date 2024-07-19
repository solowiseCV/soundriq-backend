"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const status_1 = __importDefault(require("./routes/status"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const artistRoutes_1 = __importDefault(require("./routes/artistRoutes"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const swagger_1 = __importDefault(require("./swagger/swagger"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// Middleware to parse URL-encoded data 
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
}));
app.use("/auth", authRoutes_1.default);
app.use("/artist", artistRoutes_1.default);
app.use("/", status_1.default);
(0, swagger_1.default)(app);
app.use(errorHandler_1.default);
exports.default = app;
