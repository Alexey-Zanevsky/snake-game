const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function (req, res, next) {
    if(req.method === "OPTIONS") {
        return next();
    }

    try {
        const authHeader = req.headers.authorization;
        console.log(authHeader);
        if (!authHeader) {
        return res.status(401).json({ message: 'No authorization header' });
        }
        const token = authHeader.split(' ')[1];
        if(!token) {
            return res.status(400).json({message: 'The user is not logged in'});
        }
        console.log(config.secret)
        const decodedData = jwt.verify(token, config.secret);
        req.user = decodedData;
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'The user is not logged in'});
    }
}