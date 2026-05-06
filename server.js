require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3200;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running successfully!`);
    console.log(`Server is running on: http://localhost:${PORT}`);
    console.log(`Swagger http://localhost:${PORT}/docs`);
});