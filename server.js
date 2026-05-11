const { PORT } = require('./config/config');

const app = require('./app');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');

const start = async () => {
    await connectDB();
    await connectRedis();

    app.listen(PORT, () => {
        console.log(`Server is running successfully!`);
        console.log(`Server is running on: http://localhost:${PORT}`);
        console.log(`Swagger http://localhost:${PORT}/docs`);
    });
};

start();