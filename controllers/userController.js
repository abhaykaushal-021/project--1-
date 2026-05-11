const User = require('../models/userModels');


exports.createUser = async (req, res, next) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        next(err);
       
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            const err = new Error("user not found");
            err.statusCode = 404;
            return next(err);
        }

        Object.assign(user, req.body);
        await user.save();

        res.json(user);
    } catch (err) {
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            const err = new Error("user not found");
            err.statusCode = 404;
            return next(err);
        }

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        next(err);
    }
};