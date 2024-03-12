const jwt = require("jsonwebtoken");
module.exports = function (role) {
    return function (req, res, next) {
        if (res.method === 'OPTIONS') {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                res.status.json({message: 'Пользователь не авторизован'})
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            if (decoded.role !== role) {
                res.status(403).json({message: 'У вас нет доступа'})

                // TODO ПЕРЕДЕЛАТЬ, ТК ОНО ВСЕ РАВНО ПРОПУСКАЕТ К СОЗДАНИЮ БРЕНДА
            }
            req.user = decoded
            next()
        } catch (e) {
            res.status(401).json({message: 'Пользователь не авторизован'})
        }
    }
}