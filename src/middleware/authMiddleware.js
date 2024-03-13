const jwt = require('jsonwebtoken')
const ApiError = require('../error/ApiError')

module.exports = function (req, res, next) {
    if (res.method === 'OPTIONS') {
        next()
    }
    try {
        const token = req.cookies["auth"].split(' ')[1];
        if (!token) {
            next(ApiError.unathorized("Пользователь не авторизован"));
        }
        req.user = jwt.verify(token, process.env.SECRET_KEY)
        next()
    } catch (e) {
        next(ApiError.internal("Ошибка авторизации"));
    }
}