import dotenv from "dotenv";
dotenv.config();

export default {
    port: process.env.PORT || 4400,
    dbUri: process.env.DB_URI,
    corsOrigin: process.env.CORS_ORIGIN
}