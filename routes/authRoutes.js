const express = require('express');
const router = express.Router();
const { generateToken } = require('../jwt');
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
        const token = generateToken({ id: savedUser._id, name: savedUser.name });
        res.status(201).json({ user: savedUser, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



module.exports = router;