const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config/config');

const jwtAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log("jwt hit, authHeader:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "unauthorized" });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("JWT error:", err.message);
        return res.status(401).json({ error: "invalid token" });
    }
};

const generateToken = (userData) => {
    return jwt.sign(userData, JWT_SECRET, { expiresIn: '1d' });
};

module.exports = { jwtAuthMiddleware, generateToken };