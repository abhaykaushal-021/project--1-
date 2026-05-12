const express = require('express');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const rateLimiter = require('./middlewares/rateLimiter');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const Errorhandler = require('./middlewares/Errorhandler');
const { loggerMiddleware } = require('./middlewares/logger');


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);
app.use(rateLimiter);

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
    res.send("hy its a home page");
});

app.use(Errorhandler);
app.use("/orders", require("./routes/orderRoutes"));

module.exports = app;