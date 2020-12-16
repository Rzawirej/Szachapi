const jwt = require('jsonwebtoken');
export default function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) res.status(401).send('Acces denied. No token provided.');
    try {
        req.user = jwt.verify(token, 'changeToEnv');
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
}