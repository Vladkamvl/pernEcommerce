const jwt = require('jsonwebtoken');

module.exports = (role) => {
    return (req, res, next) => {
        if (req.method === 'OPTIONS') {
            next();
        }
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    message: 'User is not login',
                });
            }
            const decodedUser = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decodedUser;
            if (role !== decodedUser) {
                return res.status(403).json({
                    message: 'You dont have access',
                });
            }
            next();
        } catch (e) {
            return res.status(401).json({
                message: 'User is not login',
            });
        }
    }
}