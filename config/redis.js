const { createClient } = require('redis');
const { REDIS_URL } = require('../config/config');

const client = createClient({ url: REDIS_URL });

client.on('error', (err) => console.error('Redis error:', err));
client.on('connect', () => console.log('Redis connected'));

const connectRedis = async () => {
    await client.connect();
};

module.exports = { client, connectRedis };