const { Type } = require('../models/models');

class TypeController {
    async add(req, res, next) {
        try {
            const name = req.body.name[0].toUpperCase() + req.body.name.slice(1);

            const candidate = await Brand.findOne({ where: { name } })
            if (candidate) {
                next(ApiError.badRequest("Такой тип уже существует"));
            }

            const type = await Type.create({ name });
            return res.json({ type });
        } catch (e) {
            console.log(e);
            return next(ApiError.internal("Произошла ошибка"));
        }
    }

    async getAll(req, res, next) {
        try {
            const types = await Type.findAll();
            return res.json({ types });
        } catch (e) {
            console.log(e);
            return next(ApiError.internal("Произошла ошибка"));
        }
    }
}

module.exports = new TypeController();
