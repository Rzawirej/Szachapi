const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userEmail) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        req.userEmail = userEmail;
        next();
    })
}