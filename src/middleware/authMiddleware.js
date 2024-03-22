const jwt = require('jsonwebtoken')
const ApiError = require('../error/ApiError');
const { User } = require('../models/models');

module.exports = async function (req, res, next) {
    if (res.method === 'OPTIONS') {
        next()
    }
    try {
        const token = req.cookies["auth"].split(' ')[1];
        if (!token) {
            return next(ApiError.unathorized("Пользователь не авторизован"));
        }
        const user = jwt.verify(token, process.env.SECRET_KEY);
        const candidate = await User.findOne({ where: { id: user.id, email: user.email, role: user.role } });

        if (!candidate) {
            return next(ApiError.unathorized("Пользователь не найден"));
        }

        req.user = user;
        next()
    } catch (e) {
        next(ApiError.internal("Ошибка авторизации"));
    }
}