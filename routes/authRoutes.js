const express = require('express');
const router = express.Router();
const { generateToken, jwtAuthMiddleware } = require('../jwt');
const { saveSession, deleteSession } = require('../middlewares/session');
const User = require('../models/userModels');

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
router.post('/signup', async (req, res) => {
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
    } catch (error) {
        res.status(400).json({ message: error.message });
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
router.post('/logout', jwtAuthMiddleware, async (req, res) => {
    try {
        await deleteSession(req.user.id);
        res.json({ message: "logged out successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "internal server error" });
    }
});

module.exports = router;