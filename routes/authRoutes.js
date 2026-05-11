const express = require('express');
const router = express.Router();
const { generateToken, jwtAuthMiddleware } = require('../jwt');
const { saveSession, deleteSession } = require('../middlewares/session');
const User = require('../models/userModels');
const validateUser = require('../middlewares/validateUser')
/**
 * @swagger
 * components:
 *   schemas:
 *     AuthPayload:
 *       type: object
 *       required:
 *         - name
 *         - password
 *       properties:
 *         name:
 *           type: string
 *         password:
 *           type: string
 */
 
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthPayload'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/signup', async (req, res, next) => {
    try {
        const newUser = new User({
            name: req.body.name,
            password: req.body.password,
            city: req.body.city || "",
            age: req.body.age || 0
        });
        const savedUser = await newUser.save();
        const token = generateToken({ id: savedUser._id.toString(), name: savedUser.name });
        await saveSession(savedUser._id.toString(), token);
        res.status(201).json({ user: savedUser, token });
    } catch (err) {
        next(err);
    }
});
 
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthPayload'
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res, next) => {
    try {
        console.log("req body is ", req.body);
        const { name, password } = req.body;
 
        const user = await User.findOne({ name: name });
        console.log(name);
 
        if (!user || (password != user.password)) {
            const err = new Error("invalid username or password");
            err.statusCode = 401;
            return next(err);
        }
 
        const payload = {
            id: user._id.toString(),
            name: user.name
        };
 
        const token = generateToken(payload);
        await saveSession(user._id.toString(), token);
 
        res.json({ token });
    } catch (err) {
        next(err);
    }
});
 
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout and destroy session
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', jwtAuthMiddleware, async (req, res, next) => {
    try {
        await deleteSession(req.user.id);
        res.json({ message: "logged out successfully" });
    } catch (err) {
        next(err);
    }
});
 
module.exports = router;
 





















