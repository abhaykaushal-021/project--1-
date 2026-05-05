module.exports = (req, res, next) => {
    const { name, city, age } = req.body;

    if (!name || !city || !age) {
        return res.status(400).json({
            message: "name, city and age are required"
        });
    }

    next();
};