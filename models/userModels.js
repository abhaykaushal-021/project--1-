const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    city: String,
    age: Number,
    address: String
});

module.exports = mongoose.model('User', userSchema);