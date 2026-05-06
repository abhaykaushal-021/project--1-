const { client } = require('../config/redis');

const SESSION_EXPIRY = 60 * 60 * 24; 

const saveSession = async (userId, token) => {
    const key = `session:${userId}`;
    await client.set(key, token, { EX: SESSION_EXPIRY });
};

const getSession = async (userId) => {
    const key = `session:${userId}`;
    return await client.get(key);
};

const deleteSession = async (userId) => {
    const key = `session:${userId}`;
    await client.del(key);
};

const sessionAuthMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "unauthorized" });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "unauthorized" });
    }

    try {
        const userId = req.user?.id;

        if (userId) {
            const storedToken = await getSession(userId);
            if (!storedToken || storedToken !== token) {
                return res.status(401).json({ error: "session expired or invalid" });
            }
        }

        next();
    } catch (err) {
        console.error('Session middleware error:', err);
        return res.status(500).json({ error: "internal server error" });
    }
};

module.exports = { saveSession, getSession, deleteSession, sessionAuthMiddleware };