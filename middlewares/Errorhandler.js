const { logger } = require('./logger');

module.exports =(err,req,res,next)=>{
    console.error(`[ERROR] ${req.method} ${req.url} -`,err.message);

    const statusCode =err.statusCode || 500;
    res.status(statusCode).json({
        success:false,
        message: 'internal server error'
    });
};