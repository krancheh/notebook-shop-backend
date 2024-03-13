const jwt = require('jsonwebtoken')
const ApiError = require('../error/ApiError')

module.exports = function (req, res, next) {
    if (res.method === 'OPTIONS') {
        next()
    }
    try {
        const token = req.cookies["auth"].split(' ')[1];
        if (!token) {
            return next(ApiError.unathorized("Пользователь не авторизован"));
        }
        const user = jwt.verify(token, process.env.SECRET_KEY);

        if (!user) {
            return next(ApiError.unathorized("Пользователь не авторизован"));
        }

        req.user = user;
        next()
    } catch (e) {
        next(ApiError.internal("Ошибка авторизации"));
    }
}