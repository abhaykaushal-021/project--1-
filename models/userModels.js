const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    city: String,
    age: Number,
    address: String,
    password: String
});

module.exports = mongoose.model('User', userSchema);