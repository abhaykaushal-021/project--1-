require('dotenv').config();

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined in .env");
if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined in .env");

module.exports = {
    PORT: process.env.PORT || 3200,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379'
};  