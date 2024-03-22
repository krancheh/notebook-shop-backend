const ApiError = require("../error/ApiError");
module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next()
        }
        try {
            const { user } = req;

            if (!user) {
                next(ApiError.unathorized('Пользователь не авторизован'));
            }

            if (user.role !== role) {
                next(ApiError.forbidden('У вас недостаточно прав'));
            }
            next()
        } catch (e) {
            console.log(e);
            next(ApiError.internal('Ошибка авторизации'));
        }
    }
}