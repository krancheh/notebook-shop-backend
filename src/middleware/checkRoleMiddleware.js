const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");
module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next()
        }
        try {
            const token = req.cookies["auth"].split(' ')[1];

            if (!token) {
                next(ApiError.unathorized('Пользователь не авторизован'));
            }

            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            if (decoded.role !== role) {
                next(ApiError.forbidden('У вас недостаточно прав'));
            }
            req.user = decoded;
            next()
        } catch (e) {
            next(ApiError.internal('Произошла ошибка'));
        }
    }
}