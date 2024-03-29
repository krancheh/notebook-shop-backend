const ApiError = require('../error/ApiError');
const { Type } = require('../models/models');

class TypeController {
    async add(req, res, next) {
        try {
            const name = req.body.name[0].toUpperCase() + req.body.name.slice(1);

            const candidate = await Type.findOne({ where: { name } })
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

    async delete(req, res, next) {
        try {
            const { id } = req.body;
            const count = await Type.destroy({ where: { id } });
            return res.json({ message: `Удалено ${count} тип(ов)` });
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
