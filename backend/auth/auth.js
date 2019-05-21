const jwt = require('jsonwebtoken');

const config = require('../config')

const protectedRoute = (req, res, next) => {
    const token = req.headers.authorization;

    if (token !== undefined) {
        jwt.verify(token.split(' ')[1], config.secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).end();
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(401).end()
    }
}

module.exports = {
    protectedRoute
}