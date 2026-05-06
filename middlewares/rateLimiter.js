const { client } = require('../config/redis');

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 10;

module.exports = async (req, res, next) => {
    const ip = req.ip;
    const key = `rate:${ip}`;

    try {
        const requests = await client.incr(key);

        if (requests === 1) {
            await client.expire(key, WINDOW_SECONDS);
        }

        if (requests > MAX_REQUESTS) {
            return res.status(429).json({
                error: `Too many requests. Max ${MAX_REQUESTS} requests per ${WINDOW_SECONDS} seconds.`
            });
        }

        res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - requests));

        next();
    } catch (err) {
        console.error('Rate limiter error:', err);
        next();
    }
};