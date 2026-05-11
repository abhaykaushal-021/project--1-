const Joi = require('joi');
 
const userSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    city: Joi.string().min(2).max(100).required(),
    age: Joi.number().integer().min(0).max(120).required(),
    address: Joi.string().min(2).max(200).optional()
});
 
module.exports = (req, res, next) => {
    const { error } = userSchema.validate(req.body, { abortEarly: false });
 
    if (error) {
        const err = new Error(error.details.map(d => d.message).join(', '));
        err.statusCode = 400;
        return next(err);
    }
 
    next();
};