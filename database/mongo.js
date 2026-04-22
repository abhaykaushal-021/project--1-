const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/mydatabase')
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.log("MongoDB connection error:", err));

/* Schema and Model */
const userSchema = new mongoose.Schema({
    name: String,
    city: String,
    age: Number,
    address: String,
});

const User = mongoose.model('User', userSchema);

module.exports =  User ;