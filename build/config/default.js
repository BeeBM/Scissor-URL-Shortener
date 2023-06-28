"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    port: process.env.PORT || 4400,
    dbUri: process.env.DB_URI,
    corsOrigin: process.env.CORS_ORIGIN
};
//# sourceMappingURL=default.js.map