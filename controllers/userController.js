const User = require('../models/userModels');

exports.createUser = async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
};

exports.getUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
};

exports.updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }

    Object.assign(user, req.body);
    await user.save();

    res.json(user);
};

exports.deleteUser = async (req, res) => {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
        return res.status(404).json({ message: "user not found" });
    }

    res.json({ message: "User deleted successfully" });
};