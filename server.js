const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const User = require('./database/mongo'); 

const app = express();
const port = 3200;

app.use(express.json());

/* Logger Middleware */
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

/* Validation Middleware */
const validateUser = (req, res, next) => {
    const { name, city, age } = req.body;

    if (!name || !city || !age) {
        return res.status(400).json({
            message: "name, city and age are required"
        });
    }

    next();
};

/* Auth Middleware */
const auth = (req, res, next) => {
    const token = req.headers.authorization;

    if (token !== "secret123") {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    next();
};

/**
 * Swagger Configuration
 */
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User CRUD API',
            version: '1.0.0',
            description: 'Express + MongoDB CRUD API Documentation'
        },
        servers: [
            {
                url: `http://127.0.0.1:${port}`
            }
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string'
                        },
                        city: {
                            type: 'string'
                        },
                        age: {
                            type: 'integer'
                        },
                        address: {
                            type: 'string'
                        }
                    }
                }
            },
            //  Security Scheme for Authorization
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'authorization',
                    description: 'Enter your token here (secret123)'
                }
            }
        }
    },
    
    apis: ['./server.js']
};
const swaggerSpec = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


/**
 * @swagger
 * /
 * get:
 *   summary: Home Page
 *   responses:
 *     200:
 *       description: Home page message
 */
app.get('/', (req, res) => {
    res.end("hy its a home page");
});


/**
* @swagger
 * /users:
 *   post:
 *     summary: Add User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created
 */
app.post('/users', validateUser, async (req, res) => {
    
    const newUser = new User(req.body);

    await newUser.save();

    console.log('user added successfully', newUser);
    res.status(201).json(newUser);
});


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Fetch All Users
 *     responses:
 *       200:
 *         description: List of users
 */
app.get('/users', async (req, res) => {
    const users = await User.find();

    console.log('users fetched successfully', users);
    res.json(users);
});


/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated
 */
app.put('/users/:id', validateUser, async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }

    user.name = req.body.name || user.name;
    user.city = req.body.city || user.city;
    user.age = req.body.age || user.age;
    user.address = req.body.address || user.address;

    await user.save();

    console.log("user Updated", user);
    res.json(user);
});


/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete User
 *     description: This route is protected. You need to authorize first.
 *     security:
 *       - ApiKeyAuth: []     # This links the security scheme
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
app.delete('/users/:id', auth, async (req, res) => {
    const id = req.params.id;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
        return res.status(404).json({ message: "user not found" });
    }

    console.log("User deleted with ID:", id);

    res.json({
        message: "User deleted successfully"
    });
});


/* Error Handling Middleware */
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        message: "Internal Server Error",
        error: err.message
    });
});


/* Start Server */
app.listen(port, () => {
    console.log(`server is running on http://127.0.0.1:${port}`);
    console.log(`Swagger Docs: http://127.0.0.1:${port}/docs`);
});