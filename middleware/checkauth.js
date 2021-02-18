const jwt = require("jsonwebtoken");
// const TOKEN_EXPIRATION = 60;
// const TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60;
// const rediss = require('./redisclient').redisClient;
module.exports = function (req, res) {
    if (req.headers && req.headers.authorization) {
        const authorization = req.headers.authorization;
        try {
            const decoded = jwt.verify(authorization.split(' ')[1], 'keep this key as secret');
            console.log(decoded);
            req.userData = { email: decoded.email, userId: decoded.userid };
            console.log(req.userData.userId)
            return res.status(200).json({
                message: 'we got token',
                datas: decoded
            })
        } catch (e) {
            return res.status(401).send('unauthorized**********');
        }
    } else {
        return res.status(401).send('unauthorized');
    }
}

// exports.expireToken = function (headers) {
//     var tokeninitial = getToken(headers);
//     if (tokeninitial != null) {
//         rediss.set(tokeninitial, { is_expired: true });
//         rediss.expire(tokeninitial, TOKEN_EXPIRATION_SEC);
//     }
// };